!(function(name, context, definition) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Vue', 'VueUtil', 'VueResource'], definition);
	} else {
		context[name] = definition(context['Vue'], context['VueUtil']);
		delete context[name];
	}
})('VueUpload', this, function(Vue, VueUtil) {
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
			Object.keys(option.data).forEach(function(key) {
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
		template: '<div class="vue-upload-dragger" :class="{ \'is-dragover\': dragover }" @drop.prevent="onDrop" @dragover.prevent="onDragover" @dragleave.prevent="dragover = false"><slot></slot></div>', 
		name: 'VueUploadDrag',
		props: {
			disabled: Boolean
		},
		data: function() {
			return {
				dragover: false
			};
		},
		methods: {
			onDragover: function() {
				if (!this.disabled) {
					this.dragover = true;
				}
			},
			onDrop: function(e) {
				if (!this.disabled) {
					this.dragover = false;
					this.$emit('file', e.dataTransfer.files);
				}
			}
		}
	};
	var UploadList = {
		template: '<transition-group tag="ul" :class="[\'vue-upload-list\', \'vue-upload-list--\' + listType, { \'is-disabled\': disabled }]" name="vue-list"><li v-for="(file, index) in files" :class="[\'vue-upload-list__item\', \'is-\' + file.status]" :key="index"><img class="vue-upload-list__item-thumbnail" v-if="file.status !== \'uploading\' && [\'picture-card\', \'picture\'].indexOf(listType) > -1" :src="file.url" alt=""><a class="vue-upload-list__item-name" @click="handleClick(file)"><i class="vue-icon-document"></i>{{file.name}}</a><label class="vue-upload-list__item-status-label"><i :class="{\'vue-icon-upload-success\': true, \'vue-icon-circle-check\': listType === \'text\', \'vue-icon-check\': [\'picture-card\', \'picture\'].indexOf(listType) > -1}"></i></label><i class="vue-icon-close" v-if="!disabled" @click="$emit(\'remove\', file)"></i><vue-progress v-if="file.status === \'uploading\'" :type="listType === \'picture-card\' ? \'circle\' : \'line\'" :stroke-width="listType === \'picture-card\' ? 6 : 2" :percentage="parsePercentage(file.percentage)"></vue-progress><span class="vue-upload-list__item-actions" v-if="listType === \'picture-card\'"><span class="vue-upload-list__item-preview" v-if="handlePreview && listType === \'picture-card\'" @click="handlePreview(file)"><i class="vue-icon-view"></i></span><span v-if="!disabled" class="vue-upload-list__item-delete" @click="$emit(\'remove\', file)"><i class="vue-icon-delete2"></i></span></span></li></transition-group>',
		props: {
			files: {
				type: Array,
				default: function() {
					return [];
				}
			},
			disabled: Boolean,
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
		inject: ['uploader'],
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
			},
			disabled: Boolean
		},
		data: function() {
			return {
				mouseover: false,
				reqs: {}
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
			},
			uploadFiles: function(files) {
				var self = this;
				var postFiles = Array.prototype.slice.call(files);
				if (!self.multiple) {
					postFiles = postFiles.slice(0, 1);
				}
				if (postFiles.length === 0) return;
				postFiles.forEach(function(rawFile) {
					self.onStart(rawFile);
					if (self.autoUpload) self.upload(rawFile);
				});
			},
			upload: function(rawFile) {
				var self = this;
				self.$refs.input.value = null;
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
			abort: function(rawFile) {
				var reqs = this.reqs;
				if (rawFile) {
					var uid = rawFile;
					if (rawFile.uid) uid = rawFile.uid;
					if (reqs[uid]) {
						reqs[uid].abort();
					}
				} else {
					Object.keys(reqs).forEach(function (uid) {
						if (reqs[uid]) reqs[uid].abort();
						delete reqs[uid];
					});
				}
			},
			post: function(rawFile) {
				var self = this;
				var uid = rawFile.uid;
				var options = {
					headers: self.headers,
					withCredentials: self.withCredentials,
					file: rawFile,
					data: self.data,
					filename: self.name,
					action: self.action,
					onProgress: function onProgress(e) {
						self.onProgress(e, rawFile);
					},
					onSuccess: function onSuccess(res) {
						self.onSuccess(res, rawFile);
						delete self.reqs[uid];
					},
					onError: function onError(err) {
						self.onError(err, rawFile);
						delete self.reqs[uid];
					}
				};
				var req = self.httpRequest(options);
				self.reqs[uid] = req;
				if (req && req.then) {
					req.then(options.onSuccess, options.onError);
				}
			},
			handleClick: function() {
				if (!this.disabled) {
					this.$refs.input.value = null;
					this.$refs.input.click();
				}
			}
		},
		render: function(createElement) {
			var handleClick = this.handleClick;
			var drag = this.drag;
			var handleChange = this.handleChange;
			var multiple = this.multiple;
			var accept = this.accept;
			var listType = this.listType;
			var uploadFiles = this.uploadFiles;
			var disabled = this.disabled;
			var data = {
				class: {
					'vue-upload': true,
					'is-disabled': disabled
				},
				on: {
					click: handleClick
				}
			};
			data.class['vue-upload--' + listType] = true;
			return createElement('div', data, [drag ? createElement('upload-dragger', {attrs: { disabled: disabled }, on: {'file': uploadFiles}}, [this.$slots.default]) : this.$slots.default, createElement('input', {class: 'vue-upload__input',attrs: {type: 'file', name: name, multiple: multiple, accept: accept}, ref: 'input', on: {'change': handleChange}}, [])]);
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
			listType: String,
			disabled: Boolean
		},
		data: function() {
			return {
				mouseover: false,
				domain: '',
				file: null,
				submitting: false
			};
		},
		methods: {
			isImage: function(str) {
				return str.indexOf('image') !== -1;
			},
			handleClick: function() {
				if (!this.disabled) {
					this.$refs.input.click();
				}
			},
			handleChange: function(ev) {
				var file = ev.target.value;
				if (file) {
					this.uploadFiles(file);
				}
			},
			uploadFiles: function(file) {
				if (this.submitting) return;
				this.submitting = true;
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
				self.submitting = false;
				self.file = null;
			}, false);
		},
		render: function(createElement) {
			var drag = this.drag;
			var uploadFiles = this.uploadFiles;
			var listType = this.listType;
			var frameName = this.frameName;
			var disabled = this.disabled;
			var oClass = {'vue-upload': true};
			oClass['vue-upload--' + listType] = true;
			return createElement('div', {'class': oClass, on: {'click': this.handleClick}, nativeOn: {'drop': this.onDrop, 'dragover': this.handleDragover, 'dragleave': this.handleDragleave}}, [createElement('iframe', {on: {'load': this.onload}, ref: 'iframe', attrs: {name: frameName}}, []), createElement('form', {ref: 'form', attrs: {action: this.action, target: frameName, enctype: 'multipart/form-data', method: 'POST'}}, [createElement('input', {'class': 'vue-upload__input',attrs: {type: 'file', name: 'file', accept: this.accept}, ref: 'input', on: {'change': this.handleChange}}, []), createElement('input', {attrs: {type: 'hidden', name: 'documentDomain', value: this.$isServer ? '' : document.domain}}, []), createElement('span', {ref: 'data'}, [])]), drag ? createElement('upload-dragger', {on: {'file': uploadFiles},attrs: {disabled: disabled}}, [this.$slots.default]) : this.$slots.default])
		}
	};
	var migrating = {
		mounted: function() {
			if (!this.$vnode) return;
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
			UploadList: UploadList,
			Upload: Upload,
			IframeUpload: IframeUpload
		},
		provide: {
			uploader: undefined
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
			},
			httpRequest: Function,
			disabled: Boolean
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
				this.onChange(file, this.uploadFiles);
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
			handleRemove: function(file, raw) {
				if (raw) {
					file = this.getFile(raw);
				}
				this.abort(file);
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
			abort: function(file) {
				this.$refs['upload-inner'].abort(file);
			},
			clearFiles: function() {
				this.uploadFiles = [];
			},
			submit: function() {
				var self = this;
				self.uploadFiles
					.filter(function(file) {
						return file.status === 'ready';
					})
					.forEach(function(file) {
						self.$refs['upload-inner'].upload(file.raw);
					});
			},
			getMigratingConfig: function() {
				return {
					props: {
						'default-file-list': 'default-file-list is renamed to file-list.',
						'show-upload-list': 'show-file-list is renamed to show-file-list.',
						'thumbnail-mode': 'thumbnail-mode has been deprecated.'
					}
				};
			}
		},
		render: function(createElement) {
			var uploadList;
			if (this.showFileList) {
				uploadList = createElement('UploadList', {attrs: {disabled: this.disabled, listType: this.listType, files: this.uploadFiles, handlePreview: this.onPreview}, on: {'remove': this.handleRemove}}, []);
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
					disabled: this.disabled,
					'on-start': this.handleStart,
					'on-progress': this.handleProgress,
					'on-success': this.handleSuccess,
					'on-error': this.handleError,
					'on-preview': this.onPreview,
					'on-remove': this.handleRemove,
					'http-request': this.httpRequest
				},
				ref: 'upload-inner'
			};
			var trigger = this.$slots.trigger || this.$slots.default;
			var uploadComponent = (typeof FormData !== 'undefined' || this.$isServer)
					? createElement('upload', uploadData, [trigger])
					: createElement('iframeUpload', uploadData, [trigger]);
			return createElement('div', null, ['picture-card' === this.listType ? uploadList : '', this.$slots.trigger ? [uploadComponent, this.$slots.default]: uploadComponent, this.$slots.tip, 'picture-card' !== this.listType ? uploadList : '']);
		},
		mounted: function() {
			if (this.disabled) {
				this.$el.querySelectorAll('button').forEach(function(buttonNote) {
					VueUtil.addClass(buttonNote, 'is-disabled');
				});
			}
		}
	};
	Vue.component(VueUpload.name, VueUpload);
});
