!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueProgress', 'VueResource'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueProgress']);
		delete context[name];
	}
})('VueUpload', this, function(Vue, VueProgress) {
	'use strict';
	var ajax = function(option) {
		if (typeof this.$http === 'undefined') {
			return;
		}
		var httpOption = {};
		httpOption.headers = option.headers;
		httpOption.progress = function progress(e) {
			if (e.total > 0) {
				e.percent = e.loaded / e.total * 100;
			}
			option.onProgress(e);
		};
		if (option.withCredentials) {
			httpOption.emulateJSON = true
		}
		var formData = new FormData();
		if (option.data) {
			Object.keys(option.data).map(function(key) {
				formData.append(key, option.data[key]);
			});
		}
		formData.append(option.filename, option.file);
		this.$http.post(option.action, formData, httpOption).then(function(reqponse){
			option.onSuccess(reqponse);
		}, function(reqponse){
			option.onError(reqponse);
		});
	}
	var UploadDragger = {
		template: '<div class="vue-upload-dragger" :class="{ \'is-dragover\': dragover }" @drop.prevent="onDrop" @dragover.prevent="dragover = true" @dragleave.prevent="dragover = false"><slot></slot></div>', 
		name: 'VueUploadDrag',
		data: function() {
			return {
				dragover: false
			};
		},
		methods: {
			onDrop: function(e) {
				this.dragover = false;
				this.$emit('file', e.dataTransfer.files);
			}
		}
	};
	var UploadList = {
		template: '<transition-group tag="ul" :class="[\'vue-upload-list\', \'vue-upload-list--\' + listType]" name="list"><li v-for="file in files" :class="[\'vue-upload-list__item\', \'is-\' + file.status]" :key="file"><img class="vue-upload-list__item-thumbnail" v-if="[\'picture-card\', \'picture\'].indexOf(listType) > -1 && file.status === \'success\'" :src="file.url" alt=""><a class="vue-upload-list__item-name" @click="handleClick(file)"><i class="vue-icon-document"></i>{{file.name}}</a><label v-show="file.status === \'success\'" class="vue-upload-list__item-status-label"><i :class="{ \'vue-icon-circle-check\': listType === \'text\', \'vue-icon-check\': [\'picture-card\', \'picture\'].indexOf(listType) > -1}"></i><i class="vue-icon-close" @click="$emit(\'remove\', file)"></i></label><span class="vue-upload-list__item-actions" v-if=" listType === \'picture-card\' && file.status === \'success\' "><span v-if=" handlePreview && listType === \'picture-card\' " @click="handlePreview(file)" class="vue-upload-list__item-preview"><i class="vue-icon-view"></i></span><span class="vue-upload-list__item-delete" @click="$emit(\'remove\', file)"><i class="vue-icon-delete2"></i></span></span><vue-progress v-if="file.status === \'uploading\'" :type="listType === \'picture-card\' ? \'circle\' : \'line\'" :stroke-width="listType === \'picture-card\' ? 6 : 2" :percentage="parsePercentage(file.percentage)"></vue-progress></li></transition-group>',
		components: { VueProgress: VueProgress() },
		props: {
			files: {
				type: Array,
				default: function() {
					return [];
				}
			},
			handlePreview: Function,
			listType: String
		},
		methods: {
			parsePercentage: function(val) {
				return parseInt(val, 10);
			},
			handleClick: function(file) {
				this.handlePreview && this.handlePreview(file);
			}
		}
	};
	var Upload = {
		components: {
			UploadDragger: UploadDragger
		},
		props: {
			type: String,
			action: {
				type: String,
				default: window.location.href
			},
			name: {
				type: String,
				default: 'file'
			},
			data: Object,
			headers: Object,
			withCredentials: Boolean,
			multiple: Boolean,
			accept: String,
			onStart: Function,
			onProgress: Function,
			onSuccess: Function,
			onError: Function,
			beforeUpload: Function,
			drag: Boolean,
			onPreview: {
				type: Function,
				default: function() {}
			},
			onRemove: {
				type: Function,
				default: function() {}
			},
			fileList: Array,
			autoUpload: Boolean,
			listType: String,
			httpRequest: {
				type: Function,
				default: ajax
			}
		},
		data: function() {
			return {
				mouseover: false
			};
		},
		methods: {
			isImage: function(str) {
				return str.indexOf('image') !== -1;
			},
			handleChange: function(ev) {
				var files = ev.target.files;
				if (!files) return;
				this.uploadFiles(files);
				this.$refs.input.value = null;
			},
			uploadFiles: function(files) {
				var self = this;
				var postFiles = Array.prototype.slice.call(files);
				if (!self.multiple) { postFiles = postFiles.slice(0, 1); }
				if (postFiles.length === 0) { return; }
				postFiles.forEach(function(rawFile) {
					self.onStart(rawFile);
					if (self.autoUpload) self.upload(rawFile);
				});
			},
			upload: function(rawFile) {
				var self = this;
				if (!self.beforeUpload) {
					return self.post(rawFile);
				}
				var before = self.beforeUpload(rawFile);
				if (before && before.then) {
					before.then(function(processedFile) {
						if (Object.prototype.toString.call(processedFile) === '[object File]') {
							self.post(processedFile);
						} else {
							self.post(rawFile);
						}
					}, function() {
						self.onRemove(rawFile, true);
					});
				} else if (before !== false) {
					self.post(rawFile);
				} else {
					self.onRemove(rawFile, true);
				}
			},
			post: function(rawFile) {
				var self = this;
				var options = {
					headers: self.headers,
					withCredentials: self.withCredentials,
					file: rawFile,
					data: self.data,
					filename: self.name,
					action: self.action,
					onProgress: function(e) {
						self.onProgress(e, rawFile);
					},
					onSuccess: function(res) {
						self.onSuccess(res, rawFile);
					},
					onError: function(err) {
						self.onError(err, rawFile);
					}
				};
				var requestPromise = self.httpRequest(options);
				if (requestPromise && requestPromise.then) {
					requestPromise.then(options.onSuccess, options.onError);
				}
			},
			handleClick: function() {
				this.$refs.input.click();
			}
		},
		render: function(createElement) {
			var handleClick = this.handleClick,
				drag = this.drag,
				handleChange = this.handleChange,
				multiple = this.multiple,
				accept = this.accept,
				listType = this.listType,
				uploadFiles = this.uploadFiles;
			var data = {
				class: {
					'vue-upload': true
				},
				on: {
					click: handleClick
				}
			};
			data.class['vue-upload--' + listType] = true;
			return createElement('div', data, [drag ? createElement('upload-dragger', {on: {file: uploadFiles}}, [this.$slots.default]) : this.$slots.default, createElement('input', {class: 'vue-upload__input',attrs: {type: 'file', multiple: multiple, accept: accept}, ref: 'input', on: {change: handleChange}}, [])]);
		}
	};
	var IframeUpload = {
		components: {
			UploadDragger: UploadDragger
		},
		props: {
			type: String,
			data: {},
			action: {
				type: String,
				default: window.location.href
			},
			name: {
				type: String,
				default: 'file'
			},
			withCredentials: Boolean,
			accept: String,
			onStart: Function,
			onProgress: Function,
			onSuccess: Function,
			onError: Function,
			beforeUpload: Function,
			onPreview: {
				type: Function,
				default: function() {}
			},
			onRemove: {
				type: Function,
				default: function() {}
			},
			drag: Boolean,
			listType: String
		},
		data: function() {
			return {
				mouseover: false,
				domain: '',
				file: null,
				disabled: false
			};
		},
		methods: {
			isImage: function(str) {
				return str.indexOf('image') !== -1;
			},
			handleClick: function() {
				this.$refs.input.click();
			},
			handleChange: function(ev) {
				var file = ev.target.value;
				if (file) {
					this.uploadFiles(file);
				}
			},
			uploadFiles: function(file) {
				if (this.disabled) return;
				this.disabled = true;
				this.file = file;
				this.onStart(file);
				var formNode = this.getFormNode();
				var dataSpan = this.getFormDataNode();
				var data = this.data;
				if (typeof data === 'function') {
					data = data(file);
				}
				var inputs = [];
				for (var key in data) {
					if (data.hasOwnProperty(key)) {
						inputs.push('<input name="' + key + '" value="' + data[key] + '"/>');
					}
				}
				dataSpan.innerHTML = inputs.join('');
				formNode.submit();
				dataSpan.innerHTML = '';
			},
			getFormNode: function() {
				return this.$refs.form;
			},
			getFormDataNode: function() {
				return this.$refs.data;
			}
		},
		created: function() {
			this.frameName = 'frame-' + Date.now();
		},
		mounted: function() {
			var self = this;
			!this.$isServer && window.addEventListener('message', function(event) {
				if (!self.file) return;
				var targetOrigin = new URL(self.action).origin;
				if (event.origin !== targetOrigin) return;
				var response = event.data;
				if (response.result === 'success') {
					self.onSuccess(response, self.file);
				} else if (response.result === 'failed') {
					self.onError(response, self.file);
				}
				self.disabled = false;
				self.file = null;
			}, false);
		},
		render: function(createElement) {
			var drag = this.drag,
				uploadFiles = this.uploadFiles,
				listType = this.listType,
				frameName = this.frameName;
			var oClass = { 'vue-upload': true };
			oClass['vue-upload--' + listType] = true;
			return createElement('div', {class: oClass, on: {click: this.handleClick}, nativeOn: {drop: this.onDrop, dragover: this.handleDragover, dragleave: this.handleDragleave}}, [createElement('iframe', {on: {load: this.onload}, ref: 'iframe', attrs: {name: frameName}}, []), createElement('form', {ref: 'form', attrs: {action: this.action, target: frameName, enctype: 'multipart/form-data', method: 'POST'}}, [createElement('input', {class: 'vue-upload__input',attrs: {type: 'file', name: 'file', accept: this.accept}, ref: 'input', on: {change: this.handleChange}}, []), createElement('input', {attrs: {type: 'hidden', name: 'documentDomain', value: this.$isServer ? '' : document.domain}}, []), createElement('span', {ref: 'data'}, [])]), drag ? createElement('upload-dragger', {on: {file: uploadFiles}}, [this.$slots.default]) : this.$slots.default])
		}
	};
	var migrating = {
		mounted: function() {
			return
		},
		methods: {
			getMigratingConfig: function() {
				return {
					props: {},
					events: {}
				};
			}
		}
	};
	var VueUpload = {
		name: 'VueUpload',
		mixins: [migrating],
		components: {
			VueProgress: VueProgress(),
			UploadList: UploadList,
			Upload: Upload,
			IframeUpload: IframeUpload
		},
		props: {
			action: {
				type: String,
				default: window.location.href
			},
			headers: {
				type: Object,
				default: function() {
					return {};
				}
			},
			data: Object,
			multiple: Boolean,
			name: {
				type: String,
				default: 'file'
			},
			drag: Boolean,
			dragger: Boolean,
			withCredentials: Boolean,
			showFileList: {
				type: Boolean,
				default: true
			},
			accept: String,
			type: {
				type: String,
				default: 'select'
			},
			beforeUpload: Function,
			onRemove: {
				type: Function,
				default: function() {}
			},
			onChange: {
				type: Function,
				default: function() {}
			},
			onPreview: {
				type: Function
			},
			onSuccess: {
				type: Function,
				default: function() {}
			},
			onProgress: {
				type: Function,
				default: function() {}
			},
			onError: {
				type: Function,
				default: function() {}
			},
			fileList: {
				type: Array,
				default: function() {
					return [];
				}
			},
			autoUpload: {
				type: Boolean,
				default: true
			},
			listType: {
				type: String,
				default: 'text'
			}
		},
		data: function() {
			return {
				uploadFiles: [],
				dragOver: false,
				draging: false,
				tempIndex: 1
			};
		},
		watch: {
			fileList: {
				immediate: true,
				handler: function(fileList) {
					var self = this;
					self.uploadFiles = fileList.map(function(item) {
						item.uid = item.uid || (Date.now() + self.tempIndex++);
						item.status = 'success';
						return item;
					});
				}
			}
		},
		methods: {
			handleStart: function(rawFile) {
				rawFile.uid = Date.now() + this.tempIndex++;
				var file = {
					status: 'ready',
					name: rawFile.name,
					size: rawFile.size,
					percentage: 0,
					uid: rawFile.uid,
					raw: rawFile
				};
				try {
					file.url = URL.createObjectURL(rawFile);
				} catch (err) {
					console.error(err);
					return;
				}
				this.uploadFiles.push(file);
			},
			handleProgress: function(ev, rawFile) {
				var file = this.getFile(rawFile);
				this.onProgress(ev, file, this.uploadFiles);
				file.status = 'uploading';
				file.percentage = ev.percent || 0;
			},
			handleSuccess: function(res, rawFile) {
				var file = this.getFile(rawFile);
				if (file) {
					file.status = 'success';
					file.response = res;
					this.onSuccess(res, file, this.uploadFiles);
					this.onChange(file, this.uploadFiles);
				}
			},
			handleError: function(err, rawFile) {
				var file = this.getFile(rawFile);
				var fileList = this.uploadFiles;
				file.status = 'fail';
				fileList.splice(fileList.indexOf(file), 1);
				this.onError(err, file, this.uploadFiles);
				this.onChange(file, this.uploadFiles);
			},
			handleRemove: function(file) {
				var fileList = this.uploadFiles;
				fileList.splice(fileList.indexOf(file), 1);
				this.onRemove(file, fileList);
			},
			getFile: function(rawFile) {
				var fileList = this.uploadFiles;
				var target;
				fileList.every(function(item) {
					target = rawFile.uid === item.uid ? item : null;
					return !target;
				});
				return target;
			},
			clearFiles: function() {
				this.uploadFiles = [];
			},
			submit: function() {
				var self = this;
				self.uploadFiles
					.filter(function(file) {return file.status === 'ready';})
					.forEach(function(file) {
						self.$refs['upload-inner'].upload(file.raw, file);
					});
			},
			getMigratingConfig: function() {
				return {
					props: {
						'default-file-list': 'default-file-list is renamed to file-list.',
						'show-upload-list': 'show-file-list is renamed to show-file-list.'
					}
				};
			}
		},
		render: function(createElement) {
			var uploadList;
			if (this.showFileList) {
				uploadList = createElement('UploadList', {attrs: {listType: this.listType, files: this.uploadFiles, handlePreview: this.onPreview}, on: {remove: this.handleRemove}}, []);
			}
			var uploadData = {
				props: {
					type: this.type,
					drag: this.drag,
					action: this.action,
					multiple: this.multiple,
					'before-upload': this.beforeUpload,
					'with-credentials': this.withCredentials,
					headers: this.headers,
					name: this.name,
					data: this.data,
					accept: this.accept,
					fileList: this.uploadFiles,
					autoUpload: this.autoUpload,
					listType: this.listType,
					'on-start': this.handleStart,
					'on-progress': this.handleProgress,
					'on-success': this.handleSuccess,
					'on-error': this.handleError,
					'on-preview': this.onPreview,
					'on-remove': this.handleRemove
				},
				ref: 'upload-inner'
			};
			var trigger = this.$slots.trigger || this.$slots.default;
			var uploadComponent = (typeof FormData !== 'undefined' || this.$isServer)
					? createElement('upload', uploadData, [trigger])
					: createElement('iframeUpload', uploadData, [trigger]);
			return createElement('div', null, ['picture-card' === this.listType ? uploadList : '', this.$slots.trigger ? [uploadComponent, this.$slots.default]: uploadComponent, this.$slots.tip, 'picture-card' !== this.listType ? uploadList : '']);
		}
	};
	Vue.component(VueUpload.name, VueUpload);
});
