/*[tplStatic 1.0 - 4975891]*/
function initDetail(window, document, shop) {
	window.toggleIntro = function() {
		var t = $("#desc");
		if (!t.data("sheight")) {
			var a = $("#desc").css("maxHeight");
			t[0].style.cssText = "padding-left:0px;background:none;";
			t.data("sheight", a);
			$("#toggle-btn").html("&and;&and; 收拢 &and;&and;")
		} else {
			t[0].style.cssText = "padding-left:0px;background:none;max-height:" + $("#desc").data("sheight");
			t.removeAttr("data-sheight");
			$("#toggle-btn").html("&or;&or; 展开 &or;&or;")
		}
	};
	if (parseInt($("#desc").eq(0).height(), 10) < 120) {
		$("#toggle-btn").hide()
	}
	var showImgIndex = 1;
	$("#pic-wrap")
			.on(
					"scroll",
					function() {
						var t = 110;
						var a = $(this).width();
						var e = Math
								.ceil((parseInt($(this).scrollLeft(), 10) + a)
										/ t);
						for (; showImgIndex <= e; showImgIndex++) {
							var o = $(".img-" + showImgIndex);
							if (o.length > 0) {
								o.attr("src", o.data("preview-src"))
										.removeClass("img-" + showImgIndex)
							}
						}
					}).trigger("scroll");
	var isMapShow = 0;
	window.openMap = function(t) {
		if ($("#map-info").length > 0) {
			if (isMapShow++ % 2 == 0) {
				$("#map-info").show()
			} else {
				$("#map-info").hide()
			}
			if (isMapShow == 1) {
				var a = shop.lng + "," + shop.lat;
				$("#map-img").attr(
						"src",
						"http://api.map.baidu.com/staticimage?width=500&height=300&zoom=17&center="
								+ a + "&markers=" + a)
			}
		} else {
			location.href = shop.addressUrl
		}
		return false
	};
	$("#shop-banner").on(
			window.CLICK_EVENT,
			function() {
				$("img[data-origin]").each(
						function() {
							$(this).attr("src", $(this).data("origin"))
									.removeAttr("data-origin")
						});
				mui.previewImage()
			});
	mui.previewImage();
	$.get(shop.clickUrl, function(data) {
		eval("data=" + data);
		if (data && data.error == 0) {
			$(".shop-phone").html('<img src="' + data.data + '">')
		}
	});
	var isCalled = 0;
	$(".call-phone").on("click", function() {
		if (isCalled) {
			location.href = "tel:" + isCalled;
			return
		}
		function showCheckCodeDialog(t) {
			showMessage(mzTpl($("#checkcode-dialog").html(), {
				message : t
			}));
			$("#checkcode-btn").on("click", function() {
				var t = $("#checkcode").val();
				if (parseInt(t, 10) < 0) {
					mui.toast("请输入正确的验证码！");
					return
				}
				loadTruePhone({
					CHECK_CODE : t
				});
				showMessage("hide")
			})
		}
		function loadTruePhone(post) {
			$.post(shop.telUrl, post, function(data) {
				eval("data=" + data);
				if (data && data.error == 0) {
					isCalled = data.data;
					location.href = "tel:" + isCalled
				} else if (data.error == 99) {
					showCheckCodeDialog(post ? "验证码输入错误" : "")
				}
			})
		}
		loadTruePhone()
	});
	window.jobDetail = function(t) {
		window.API.post("job_detail", {
			id : t
		}, function(t) {
			if (t) {
				if (t.error) {
					showMessage(t.data)
				} else {
					showMessage(mzTpl($("#job-detail").html(), t.extend))
				}
			} else {
				showMessage("获取招聘信息失败，请重试")
			}
		})
	};
	window.shareTimelineConfig = {
		imgUrl : $("#shop-icon").attr("src"),
		desc : $.trim($("#shop-share").text()) + "\n" + shop.address
	};
	$("#fans-more").on("click", function() {
		var t = $(this).data("pages");
		var a = parseInt($(this).data("page"), 10);
		var e = $(this).data("pagesize");
		if (a > t) {
			$("#fans-more-text").hide();
			return
		}
		$(this).data("page", ++a);
		if (a >= t) {
			$("#fans-more-text").hide()
		}
		window.API.post("shop_fans", {
			page : a,
			id : shop.id,
			pagesize : e
		}, function(t) {
			if (t.error == 0 && t.extend.list) {
				var a = mzTpl($("#fan-users").html());
				var e = a(t.extend);
				$("#fan-extend-list").append(e)
			}
		})
	});

	window.tagCallback = function(t) {
		if (!t) {
			mui.toast("打标签失败");
			return
		}
		mui.toast(t.data);
		$("#rate-tag").val("")
	};
	$(".shop-raking").each(
			function() {
				var t = $(this);
				var a = function(a) {
					if (t.data("readonly") || !t.data("id")) {
						return
					}
				
					$.post(firmurl, {
						shop_id : t.data("id"),
						openid : openid,
						star : a
					}, function(t) {
						var t = eval('('+t+')');
						if (!t) {
							mui.toast("评分失败");
							return
						}
		
					if (t.error == 0) {
					
							$(".shop-raking")
							.rateYo("rating", t.extend.perstar);
							$(".perstar").html(t.extend.perstar)
							
						}
						mui.toast(t.data);
					})
				};
				var e = null;
				var o = $(this).rateYo({
					starWidth : "20px",
					normalFill : "#A0A0A0",
					spacing : "5px",
					rating : $(this).data("rating") ? 0 : shop.perstar,
					fullStar : true,
					readOnly : $(this).data("readonly") ? true : false
				});
				var i = 0;
				o.on(window.CLICK_EVENT, function(t, n) {
					if (e != null) {
						clearTimeout(e)
					}
					e = setTimeout(function() {
						e = null;
						var t = o.rateYo("rating");
						if (i == t) {
							return
						}
						i = t;
						a(t)
					}, 3e3)
				})
			});
	$(".raking-tag-big").find("span[data-id]").on(
			"click",
			function() {
				var t = $(this);
				var a = t.data("id");
				var tflag=t.attr("data");
				if (!a) {
					return
				}
				$.post(firmtag, {
					shop_id : shop.id,
					openid:openid,
					tflag:tflag,
					tag_id : a
				}, function(a) {
					var a = eval('('+a+')');
					if (!a) {
						mui.toast("操作失败，请重试");
						return
					}
					if (a.error == 0) {
						if (a.extend.tflag == 1) {
							t.addClass("active")
							
						} else {
							t.removeClass("active")
						}
						t.attr("data",a.extend.tflag);
						t.find(".num").html(a.extend.tagnum);
					}
					mui.toast(a.data)
				})
			});
	
	$("#tag-submit-btn").on("click",function(){
		var a = $("#rate-tag").val();
		if (!a) {
			mui.toast("标签不为空");
			return
		}
		$.post(firmtag, {
			shop_id : shop.id,
			openid:openid,
			flag:1,
			tag : a
		}, function(a) {
			var a = eval('('+a+')');
			if (!a) {
				mui.toast("操作失败，请重试");
				return
			}
			if (a.error == 0) {
			
			}
			mui.toast(a.data)
		})
		
	})
	if (shop.lng) {
		var map = new BMap.Map(document.createElement("div"));
		var geoLocation = new BMap.Geolocation;
		geoLocation
				.getCurrentPosition(
						function(t) {
							if (this.getStatus() == BMAP_STATUS_SUCCESS) {
								var a = new BMap.Point(shop.lng, shop.lat);
								var e = map.getDistance(a, t.point).toFixed(2);
								var o = "";
								var i = function(a) {
									if (n.getStatus() != BMAP_STATUS_SUCCESS) {
										return
									}
									console.log(a);
									var e = a.getPlan(0);
									$("#location-far").text(
											e.getDistance(true) + "，路程约"
													+ e.getDuration(true));
									$("#location-far-wrap")
											.show()
											.on(
													"click",
													function() {
														var a = "http://api.map.baidu.com/direction?origin=latlng:"
																+ t.point.lat
																+ ","
																+ t.point.lng
																+ "|name:我的位置&destination=latlng:"
																+ shop.lat
																+ ","
																+ shop.lng
																+ "|name:"
																+ shop.name
																+ "&mode=driving&region="
																+ shop.country
																+ "&output=html&src=114|weixin";
														window.open(a)
													})
								};
								var n = new BMap.DrivingRoute(map, {
									onSearchComplete : i
								});
								n.search(t.point, a)
							} else {
							}
						}, {
							enableHighAccuracy : true
						})
	}
	$("#qr-btn").on(
			"click",
			function() {
				var t = "<img src=" + qrurl
						+ ' style="display:block;margin:0 auto">';
				showMessage(t)
			})
};
(function(e, t) {
	var i = '<div id="{{id}}" class="mui-slider mui-preview-image mui-fullscreen"><div class="mui-preview-header">{{header}}</div><div class="mui-slider-group"></div><div class="mui-preview-footer mui-hidden">{{footer}}</div><div class="mui-preview-close">X</div><div class="mui-preview-loading"><span class="mui-spinner mui-spinner-white"></span></div></div>';
	var s = '<div class="mui-slider-item mui-zoom-wrapper {{className}}"><div class="mui-zoom-scroller"><img src="{{src}}" data-preview-lazyload="{{lazyload}}" style="{{style}}" class="mui-zoom"></div></div>';
	var r = "__DEFAULT";
	var a = document.createElement("div");
	var n = 0;
	var o = function(t) {
		this.options = e.extend(true, {
			id : "__MUI_PREVIEWIMAGE",
			zoom : true,
			header : '<span class="mui-preview-indicator"></span>',
			footer : ""
		}, t || {});
		this.init();
		this.initEvent()
	};
	var l = o.prototype;
	l.init = function() {
		var t = this;
		var s = this.options;
		var r = document.getElementById(this.options.id);
		if (!r) {
			a.innerHTML = i.replace(/\{\{id\}\}/g, this.options.id).replace(
					"{{header}}", s.header).replace("{{footer}}", s.footer);
			document.body.appendChild(a.firstElementChild);
			r = document.getElementById(this.options.id)
		}
		e.options.gestureConfig.pinch = true;
		e.options.gestureConfig.doubletap = true;
		this.element = r;
		this.scroller = this.element.querySelector(e
				.classSelector(".slider-group"));
		this.indicator = this.element.querySelector(e
				.classSelector(".preview-indicator"));
		this.loader = this.element.querySelector(e
				.classSelector(".preview-loading"));
		if (s.footer) {
			this.element.querySelector(e.classSelector(".preview-footer")).classList
					.remove(e.className("hidden"))
		}
		this.closeBtn = this.element.querySelector(e
				.classSelector(".preview-close"));
		this.addImages()
	};
	l.initEvent = function() {
		var i = this;
		e(document.body).on(t.CLICK_EVENT, "img[data-preview-src]", function() {
			if (i.isAnimationing()) {
				return false
			}
			i.open(this);
			return false
		});
		var s = null;
		var r = function() {
			!s && (s = e.later(function() {
				i.isInAnimation = true;
				i.loader.removeEventListener(t.CLICK_EVENT, r);
				i.scroller.removeEventListener("double" + t.CLICK_EVENT, r);
				i.close()
			}, 300))
		};
		this.scroller.addEventListener("double" + t.CLICK_EVENT, function() {
			if (s) {
				s.cancel();
				s = null
			}
		});
		this.closeBtn.addEventListener(t.CLICK_EVENT, r);
		this.scroller.addEventListener(t.CLICK_EVENT, r);
		this.element.addEventListener("webkitAnimationEnd", function() {
			if (i.element.classList.contains(e.className("preview-out"))) {
				i.element.style.display = "none";
				i.element.classList.remove(e.className("preview-out"));
				s = null
			} else {
				i.loader.addEventListener(t.CLICK_EVENT, r);
				i.scroller.addEventListener(t.CLICK_EVENT, r)
			}
			i.isInAnimation = false
		});
		this.element.addEventListener("slide", function(t) {
			if (i.options.zoom) {
				var s = i.element.querySelector(".mui-zoom-wrapper:nth-child("
						+ (i.lastIndex + 1) + ")");
				if (s) {
					e(s).zoom().setZoom(1)
				}
			}
			var r = t.detail.slideNumber;
			i.lastIndex = r;
			i.indicator
					&& (i.indicator.innerText = r + 1 + "/"
							+ i.currentGroup.length);
			i._loadItem(r)
		})
	};
	l.isAnimationing = function() {
		if (this.isInAnimation) {
			return true
		}
		this.isInAnimation = true;
		return false
	};
	l.addImages = function(e, t) {
		this.groups = {};
		var i = [];
		if (e) {
			if (e === r) {
				i = document
						.querySelectorAll("img[data-preview-src]:not([data-preview-group])")
			} else {
				i = document
						.querySelectorAll("img[data-preview-src][data-preview-group='"
								+ e + "']")
			}
		} else {
			i = document.querySelectorAll("img[data-preview-src]")
		}
		if (i.length) {
			for (var s = 0, a = i.length; s < a; s++) {
				this.addImage(i[s])
			}
		}
	};
	l.addImage = function(e) {
		var t = e.getAttribute("data-preview-group");
		t = t || r;
		if (!this.groups[t]) {
			this.groups[t] = []
		}
		var i = e.getAttribute("data-preview-src");
		var s = e.getAttribute("data-preview-desc");
		var a = e.getAttribute("src") ? e.getAttribute("src") : i;
		if (a.search(/about\:blank/gi) > -1) {
			a = i
		}
		if (e.__mui_img_data && e.__mui_img_data.src === a) {
			if (this.groups[t].length) {
				isFind = 0;
				for ( var n in this.groups[t]) {
					if (this.groups[t][n].src == a) {
						isFind = 1
					}
				}
				if (isFind) {
					return
				}
			}
			this.groups[t].push(e.__mui_img_data)
		} else {
			if (!i) {
				i = a
			}
			var o = {
				src : a,
				lazyload : a === i ? "" : i,
				loaded : a === i ? true : false,
				sWidth : 0,
				sHeight : 0,
				sTop : 0,
				sLeft : 0,
				sDesc : s,
				sScale : 1,
				el : e
			};
			if (this.groups[t].length) {
				isFind = 0;
				for ( var n in this.groups[t]) {
					if (this.groups[t][n].src == a) {
						isFind = 1
					}
				}
				if (isFind) {
					return
				}
			}
			this.groups[t].push(o);
			e.__mui_img_data = o
		}
	};
	l.empty = function() {
		this.scroller.innerHTML = ""
	};
	l._initImgData = function(i, s) {
		if (!i.sWidth) {
			var r = i.el;
			i.sWidth = r.offsetWidth;
			i.sHeight = r.offsetHeight;
			var a = e.offset(r);
			i.sTop = a.top;
			i.sLeft = a.left;
			i.sScale = Math.max(i.sWidth / t.innerWidth, i.sHeight
					/ t.innerHeight)
		}
		s.style.webkitTransform = "translate3d(0,0,0) scale(" + i.sScale + ")"
	};
	l._getScale = function(e, t) {
		var i = e.width / t.width;
		var s = e.height / t.height;
		var r = 1;
		if (i <= s) {
			r = e.height / (t.height * i)
		} else {
			r = e.width / (t.width * s)
		}
		return r
	};
	l._imgTransitionEnd = function(t) {
		var i = t.target;
		i.classList.remove(e.className("transitioning"));
		i.removeEventListener("webkitTransitionEnd", this._imgTransitionEnd
				.bind(this))
	};
	l._loadItem = function(t, i) {
		var s = this.scroller.querySelector(e
				.classSelector(".slider-item:nth-child(" + (t + 1) + ")"));
		var r = this.currentGroup[t];
		var a = s.querySelector("img");
		this._initImgData(r, a);
		if (i) {
			var n = this._getPosition(r);
			a.style.webkitTransitionDuration = "0ms";
			a.style.webkitTransform = "translate3d(" + n.x + "px," + n.y
					+ "px,0) scale(" + r.sScale + ")";
			a.offsetHeight
		}
		if (!r.loaded && a.getAttribute("data-preview-lazyload")) {
			var o = this;
			o.loader.classList.add(e.className("active"));
			a.style.webkitTransitionDuration = "0.5s";
			a.addEventListener("webkitTransitionEnd", o._imgTransitionEnd
					.bind(o));
			a.style.webkitTransform = "translate3d(0,0,0) scale(" + r.sScale
					+ ")";
			this.loadImage(a, function() {
				r.loaded = true;
				a.src = r.lazyload;
				o._initZoom(s, this.width, this.height);
				a.classList.add(e.className("transitioning"));
				a.addEventListener("webkitTransitionEnd", o._imgTransitionEnd
						.bind(o));
				a.setAttribute("style", "");
				a.offsetHeight;
				o.loader.classList.remove(e.className("active"))
			})
		} else {
			r.lazyload && (a.src = r.lazyload);
			this._initZoom(s, a.width, a.height);
			a.classList.add(e.className("transitioning"));
			a.addEventListener("webkitTransitionEnd", this._imgTransitionEnd
					.bind(this));
			a.setAttribute("style", "");
			a.offsetHeight;
			var l = this.element.querySelector(e
					.classSelector(".preview-footer"));
			l.innerHTML = r.sDesc;
			if (r.sDesc) {
				l.classList.remove(e.className("hidden"))
			} else {
				l.classList.add(e.className("hidden"))
			}
		}
		this._preloadItem(t + 1);
		this._preloadItem(t - 1)
	};
	l._preloadItem = function(t) {
		var i = this.scroller.querySelector(e
				.classSelector(".slider-item:nth-child(" + (t + 1) + ")"));
		if (i) {
			var s = this.currentGroup[t];
			if (!s.sWidth) {
				var r = i.querySelector("img");
				this._initImgData(s, r)
			}
		}
	};
	l._initZoom = function(t, i, s) {
		if (!this.options.zoom) {
			return
		}
		if (t.getAttribute("data-zoomer")) {
			return
		}
		var r = t.querySelector(e.classSelector(".zoom"));
		if (r.tagName === "IMG") {
			var a = this;
			var n = a._getScale({
				width : t.offsetWidth,
				height : t.offsetHeight
			}, {
				width : i,
				height : s
			});
			e(t).zoom({
				maxZoom : Math.max(n, 1)
			})
		} else {
			e(t).zoom()
		}
	};
	l.loadImage = function(e, t) {
		var i = function() {
			t && t.call(this)
		};
		var s = new Image;
		s.onload = i;
		s.onerror = i;
		s.src = e.getAttribute("data-preview-lazyload")
	};
	l.getRangeByIndex = function(e, t) {
		return {
			from : 0,
			to : t - 1
		}
	};
	l._getPosition = function(e) {
		var i = e.sLeft - t.pageXOffset;
		var s = e.sTop - t.pageYOffset;
		var r = (t.innerWidth - e.sWidth) / 2;
		var a = (t.innerHeight - e.sHeight) / 2;
		return {
			left : i,
			top : s,
			x : i - r,
			y : s - a
		}
	};
	l.refresh = function(i, r) {
		this.currentGroup = r;
		var a = r.length;
		var n = [];
		var o = this.getRangeByIndex(i, a);
		var l = o.from;
		var d = o.to + 1;
		var c = i;
		var h = "";
		var u = "";
		var m = t.innerWidth;
		var v = t.innerHeight;
		for (var f = 0; l < d; l++, f++) {
			var p = r[l];
			var g = "";
			if (p.sWidth) {
				g = "-webkit-transform:translate3d(0,0,0) scale(" + p.sScale
						+ ");transform:translate3d(0,0,0) scale(" + p.sScale
						+ ")"
			}
			u = s.replace("{{src}}", p.src).replace("{{lazyload}}", p.lazyload)
					.replace("{{style}}", g);
			if (l === i) {
				c = f;
				h = e.className("active")
			} else {
				h = ""
			}
			n.push(u.replace("{{className}}", h))
		}
		this.scroller.innerHTML = n.join("");
		this.element.style.display = "block";
		this.element.classList.add(e.className("preview-in"));
		this.lastIndex = c;
		this.element.offsetHeight;
		e(this.element).slider().gotoItem(c, 0);
		this.indicator
				&& (this.indicator.innerText = c + 1 + "/"
						+ this.currentGroup.length);
		this._loadItem(c, true)
	};
	l.openByGroup = function(e, t) {
		e = Math.min(Math.max(0, e), this.groups[t].length - 1);
		this.refresh(e, this.groups[t])
	};
	l.open = function(t, i) {
		if (this.element.classList.contains(e.className("preview-in"))) {
			return
		}
		if (typeof t === "number") {
			i = i || r;
			this.addImages(i, t);
			this.openByGroup(t, i)
		} else {
			i = t.getAttribute("data-preview-group");
			i = i || r;
			this.addImages(i, t);
			var s = -1;
			for ( var a in this.groups[i]) {
				if (this.groups[i][a].el.outerHTML == t.outerHTML) {
					s = a;
					break
				}
			}
			this.openByGroup(s, i)
		}
	};
	l.close = function(i, s) {
		this.element.classList.remove(e.className("preview-in"));
		this.element.classList.add(e.className("preview-out"));
		var r = this.scroller.querySelector(e
				.classSelector(".slider-item:nth-child(" + (this.lastIndex + 1)
						+ ")"));
		var a = r.querySelector("img");
		if (a) {
			a.classList.add(e.className("transitioning"));
			var n = this.currentGroup[this.lastIndex];
			var o = this._getPosition(n);
			var l = o.left;
			var d = o.top;
			if (d > t.innerHeight || l > t.innerWidth || d < 0 || l < 0) {
				a.style.opacity = 0;
				a.style.webkitTransitionDuration = "0.5s";
				a.style.webkitTransform = "scale(" + n.sScale + ")"
			} else {
				if (this.options.zoom) {
					e(a.parentNode.parentNode).zoom().toggleZoom(0)
				}
				a.style.webkitTransitionDuration = "0.5s";
				a.style.webkitTransform = "translate3d(" + o.x + "px," + o.y
						+ "px,0) scale(" + n.sScale + ")"
			}
		}
		var c = this.element.querySelectorAll(e.classSelector(".zoom-wrapper"));
		for (var h = 0, u = c.length; h < u; h++) {
			e(c[h]).zoom().destory()
		}
	};
	l.isShown = function() {
		return this.element.classList.contains(e.className("preview-in"))
	};
	var d = null;
	e.previewImage = function(e) {
		if (!d) {
			d = new o(e)
		}
		return d
	};
	e.getPreviewImage = function() {
		return d
	}
})(mui, window);
;

(function($, window) {
	var CLASS_ZOOM = $.className('zoom');
	var CLASS_ZOOM_SCROLLER = $.className('zoom-scroller');
	var SELECTOR_ZOOM = '.' + CLASS_ZOOM;
	var SELECTOR_ZOOM_SCROLLER = '.' + CLASS_ZOOM_SCROLLER;
	var EVENT_PINCH_START = 'pinchstart';
	var EVENT_PINCH = 'pinch';
	var EVENT_PINCH_END = 'pinchend';
	if ('ongesturestart' in window) {
		EVENT_PINCH_START = 'gesturestart';
		EVENT_PINCH = 'gesturechange';
		EVENT_PINCH_END = 'gestureend';
	}
	$.Zoom = function(element, options) {
		var zoom = this;
		zoom.options = $.extend($.Zoom.defaults, options);
		zoom.wrapper = zoom.element = element;
		zoom.scroller = element.querySelector(SELECTOR_ZOOM_SCROLLER);
		zoom.scrollerStyle = zoom.scroller && zoom.scroller.style;
		zoom.zoomer = element.querySelector(SELECTOR_ZOOM);
		zoom.zoomerStyle = zoom.zoomer && zoom.zoomer.style;
		zoom.init = function() {
			zoom.initEvents();
		};
		zoom.initEvents = function(detach) {
			var action = detach ? 'removeEventListener' : 'addEventListener';
			var target = zoom.scroller;
			target[action](EVENT_PINCH_START, zoom.onPinchstart);
			target[action](EVENT_PINCH, zoom.onPinch);
			target[action](EVENT_PINCH_END, zoom.onPinchend);
			target[action]('touchstart', zoom.onTouchstart);
			target[action]('touchmove', zoom.onTouchMove);
			target[action]('touchcancel', zoom.onTouchEnd);
			target[action]('touchend', zoom.onTouchEnd);
			target[action]('drag', function(e) {
				if (imageIsMoved || isGesturing) {
					e.stopPropagation();
				}
			});
			target[action]('doubletap', function(e) {
				zoom.toggleZoom(e.detail.center);
			});
		};
		zoom.transition = function(style, time) {
			time = time || 0;
			style['webkitTransitionDuration'] = time + 'ms';
			return zoom;
		};
		zoom.translate = function(style, x, y) {
			x = x || 0;
			y = y || 0;
			style['webkitTransform'] = 'translate3d(' + x + 'px,' + y
					+ 'px,0px)';
			return zoom;
		};
		zoom.scale = function(style, scale) {
			scale = scale || 1;
			style['webkitTransform'] = 'translate3d(0,0,0) scale(' + scale
					+ ')';
			return zoom;
		};
		zoom.scrollerTransition = function(time) {
			return zoom.transition(zoom.scrollerStyle, time);
		};
		zoom.scrollerTransform = function(x, y) {
			return zoom.translate(zoom.scrollerStyle, x, y);
		};
		zoom.zoomerTransition = function(time) {
			return zoom.transition(zoom.zoomerStyle, time);
		};
		zoom.zoomerTransform = function(scale) {
			return zoom.scale(zoom.zoomerStyle, scale);
		};
		var scale = 1, currentScale = 1, isScaling = false, isGesturing = false;
		zoom.onPinchstart = function(e) {
			isGesturing = true;
		};
		zoom.onPinch = function(e) {
			if (!isScaling) {
				zoom.zoomerTransition(0);
				isScaling = true;
			}
			scale = (e.detail ? e.detail.scale : e.scale) * currentScale;
			if (scale > zoom.options.maxZoom) {
				scale = zoom.options.maxZoom - 1
						+ Math.pow((scale - zoom.options.maxZoom + 1), 0.5);
			}
			if (scale < zoom.options.minZoom) {
				scale = zoom.options.minZoom + 1
						- Math.pow((zoom.options.minZoom - scale + 1), 0.5);
			}
			zoom.zoomerTransform(scale);
		};
		zoom.onPinchend = function(e) {
			scale = Math.max(Math.min(scale, zoom.options.maxZoom),
					zoom.options.minZoom);
			zoom.zoomerTransition(zoom.options.speed).zoomerTransform(scale);
			currentScale = scale;
			isScaling = false;
		};
		zoom.setZoom = function(newScale) {
			scale = currentScale = newScale;
			zoom.scrollerTransition(zoom.options.speed).scrollerTransform(0, 0);
			zoom.zoomerTransition(zoom.options.speed).zoomerTransform(scale);
		};
		zoom.toggleZoom = function(position, speed) {
			if (typeof position === 'number') {
				speed = position;
				position = undefined;
			}
			speed = typeof speed === 'undefined' ? zoom.options.speed : speed;
			if (scale && scale !== 1) {
				scale = currentScale = 1;
				zoom.scrollerTransition(speed).scrollerTransform(0, 0);
			} else {
				scale = currentScale = zoom.options.maxZoom;
				if (position) {
					var offset = $.offset(zoom.zoomer);
					var top = offset.top;
					var left = offset.left;
					var offsetX = (position.x - left) * scale;
					var offsetY = (position.y - top) * scale;
					this._cal();
					if (offsetX >= imageMaxX
							&& offsetX <= (imageMaxX + wrapperWidth)) {
						offsetX = imageMaxX - offsetX + wrapperWidth / 2;
					} else if (offsetX < imageMaxX) {
						offsetX = imageMaxX - offsetX + wrapperWidth / 2;
					} else if (offsetX > (imageMaxX + wrapperWidth)) {
						offsetX = imageMaxX + wrapperWidth - offsetX
								- wrapperWidth / 2;
					}
					if (offsetY >= imageMaxY
							&& offsetY <= (imageMaxY + wrapperHeight)) {
						offsetY = imageMaxY - offsetY + wrapperHeight / 2;
					} else if (offsetY < imageMaxY) {
						offsetY = imageMaxY - offsetY + wrapperHeight / 2;
					} else if (offsetY > (imageMaxY + wrapperHeight)) {
						offsetY = imageMaxY + wrapperHeight - offsetY
								- wrapperHeight / 2;
					}
					offsetX = Math.min(Math.max(offsetX, imageMinX), imageMaxX);
					offsetY = Math.min(Math.max(offsetY, imageMinY), imageMaxY);
					zoom.scrollerTransition(speed).scrollerTransform(offsetX,
							offsetY);
				} else {
					zoom.scrollerTransition(speed).scrollerTransform(0, 0);
				}
			}
			zoom.zoomerTransition(speed).zoomerTransform(scale);
		};
		zoom._cal = function() {
			wrapperWidth = zoom.wrapper.offsetWidth;
			wrapperHeight = zoom.wrapper.offsetHeight;
			imageWidth = zoom.zoomer.offsetWidth;
			imageHeight = zoom.zoomer.offsetHeight;
			var scaledWidth = imageWidth * scale;
			var scaledHeight = imageHeight * scale;
			imageMinX = Math.min((wrapperWidth / 2 - scaledWidth / 2), 0);
			imageMaxX = -imageMinX;
			imageMinY = Math.min((wrapperHeight / 2 - scaledHeight / 2), 0);
			imageMaxY = -imageMinY;
		};
		var wrapperWidth, wrapperHeight, imageIsTouched, imageIsMoved, imageCurrentX, imageCurrentY, imageMinX, imageMinY, imageMaxX, imageMaxY, imageWidth, imageHeight, imageTouchesStart = {}, imageTouchesCurrent = {}, imageStartX, imageStartY, velocityPrevPositionX, velocityPrevTime, velocityX, velocityPrevPositionY, velocityY;
		zoom.onTouchstart = function(e) {
			e.preventDefault();
			imageIsTouched = true;
			imageTouchesStart.x = e.type === 'touchstart' ? e.targetTouches[0].pageX
					: e.pageX;
			imageTouchesStart.y = e.type === 'touchstart' ? e.targetTouches[0].pageY
					: e.pageY;
		};
		zoom.onTouchMove = function(e) {
			e.preventDefault();
			if (!imageIsTouched)
				return;
			if (!imageIsMoved) {
				wrapperWidth = zoom.wrapper.offsetWidth;
				wrapperHeight = zoom.wrapper.offsetHeight;
				imageWidth = zoom.zoomer.offsetWidth;
				imageHeight = zoom.zoomer.offsetHeight;
				var translate = $.parseTranslateMatrix($.getStyles(
						zoom.scroller, 'webkitTransform'));
				imageStartX = translate.x || 0;
				imageStartY = translate.y || 0;
				zoom.scrollerTransition(0);
			}
			var scaledWidth = imageWidth * scale;
			var scaledHeight = imageHeight * scale;
			if (scaledWidth < wrapperWidth && scaledHeight < wrapperHeight)
				return;
			imageMinX = Math.min((wrapperWidth / 2 - scaledWidth / 2), 0);
			imageMaxX = -imageMinX;
			imageMinY = Math.min((wrapperHeight / 2 - scaledHeight / 2), 0);
			imageMaxY = -imageMinY;
			imageTouchesCurrent.x = e.type === 'touchmove' ? e.targetTouches[0].pageX
					: e.pageX;
			imageTouchesCurrent.y = e.type === 'touchmove' ? e.targetTouches[0].pageY
					: e.pageY;
			if (!imageIsMoved && !isScaling) {
				if ((Math.floor(imageMinX) === Math.floor(imageStartX) && imageTouchesCurrent.x < imageTouchesStart.x)
						|| (Math.floor(imageMaxX) === Math.floor(imageStartX) && imageTouchesCurrent.x > imageTouchesStart.x)) {
					imageIsTouched = false;
					return;
				}
			}
			imageIsMoved = true;
			imageCurrentX = imageTouchesCurrent.x - imageTouchesStart.x
					+ imageStartX;
			imageCurrentY = imageTouchesCurrent.y - imageTouchesStart.y
					+ imageStartY;
			if (imageCurrentX < imageMinX) {
				imageCurrentX = imageMinX + 1
						- Math.pow((imageMinX - imageCurrentX + 1), 0.8);
			}
			if (imageCurrentX > imageMaxX) {
				imageCurrentX = imageMaxX - 1
						+ Math.pow((imageCurrentX - imageMaxX + 1), 0.8);
			}
			if (imageCurrentY < imageMinY) {
				imageCurrentY = imageMinY + 1
						- Math.pow((imageMinY - imageCurrentY + 1), 0.8);
			}
			if (imageCurrentY > imageMaxY) {
				imageCurrentY = imageMaxY - 1
						+ Math.pow((imageCurrentY - imageMaxY + 1), 0.8);
			}
			if (!velocityPrevPositionX)
				velocityPrevPositionX = imageTouchesCurrent.x;
			if (!velocityPrevPositionY)
				velocityPrevPositionY = imageTouchesCurrent.y;
			if (!velocityPrevTime)
				velocityPrevTime = $.now();
			velocityX = (imageTouchesCurrent.x - velocityPrevPositionX)
					/ ($.now() - velocityPrevTime) / 2;
			velocityY = (imageTouchesCurrent.y - velocityPrevPositionY)
					/ ($.now() - velocityPrevTime) / 2;
			if (Math.abs(imageTouchesCurrent.x - velocityPrevPositionX) < 2)
				velocityX = 0;
			if (Math.abs(imageTouchesCurrent.y - velocityPrevPositionY) < 2)
				velocityY = 0;
			velocityPrevPositionX = imageTouchesCurrent.x;
			velocityPrevPositionY = imageTouchesCurrent.y;
			velocityPrevTime = $.now();
			zoom.scrollerTransform(imageCurrentX, imageCurrentY);
		};
		zoom.onTouchEnd = function(e) {
			if (!e.touches.length) {
				isGesturing = false;
			}
			if (!imageIsTouched || !imageIsMoved) {
				imageIsTouched = false;
				imageIsMoved = false;
				return;
			}
			imageIsTouched = false;
			imageIsMoved = false;
			var momentumDurationX = 300;
			var momentumDurationY = 300;
			var momentumDistanceX = velocityX * momentumDurationX;
			var newPositionX = imageCurrentX + momentumDistanceX;
			var momentumDistanceY = velocityY * momentumDurationY;
			var newPositionY = imageCurrentY + momentumDistanceY;
			if (velocityX !== 0)
				momentumDurationX = Math.abs((newPositionX - imageCurrentX)
						/ velocityX);
			if (velocityY !== 0)
				momentumDurationY = Math.abs((newPositionY - imageCurrentY)
						/ velocityY);
			var momentumDuration = Math.max(momentumDurationX,
					momentumDurationY);
			imageCurrentX = newPositionX;
			imageCurrentY = newPositionY;
			var scaledWidth = imageWidth * scale;
			var scaledHeight = imageHeight * scale;
			imageMinX = Math.min((wrapperWidth / 2 - scaledWidth / 2), 0);
			imageMaxX = -imageMinX;
			imageMinY = Math.min((wrapperHeight / 2 - scaledHeight / 2), 0);
			imageMaxY = -imageMinY;
			imageCurrentX = Math.max(Math.min(imageCurrentX, imageMaxX),
					imageMinX);
			imageCurrentY = Math.max(Math.min(imageCurrentY, imageMaxY),
					imageMinY);
			zoom.scrollerTransition(momentumDuration).scrollerTransform(
					imageCurrentX, imageCurrentY);
		};
		zoom.destory = function() {
			zoom.initEvents(true);
			delete $.data[zoom.wrapper.getAttribute('data-zoomer')];
			zoom.wrapper.setAttribute('data-zoomer', '');
		}
		zoom.init();
		return zoom;
	};
	$.Zoom.defaults = {
		speed : 300,
		maxZoom : 3,
		minZoom : 1,
	};
	$.fn.zoom = function(options) {
		var zoomApis = [];
		this.each(function() {
			var zoomApi = null;
			var self = this;
			var id = self.getAttribute('data-zoomer');
			if (!id) {
				id = ++$.uuid;
				$.data[id] = zoomApi = new $.Zoom(self, options);
				self.setAttribute('data-zoomer', id);
			} else {
				zoomApi = $.data[id];
			}
			zoomApis.push(zoomApi);
		});
		return zoomApis.length === 1 ? zoomApis[0] : zoomApis;
	};
})(mui, window);
;
(function(r) {
	"use strict";
	var t = "" + '<svg version="1.1"' + 'xmlns="http://www.w3.org/2000/svg"'
			+ 'viewBox="0 12.705 512 486.59"' + 'x="0px" y="0px"'
			+ 'xml:space="preserve">' + "<polygon "
			+ 'points="256.814,12.705 317.205,198.566'
			+ " 512.631,198.566 354.529,313.435 "
			+ "414.918,499.295 256.814,384.427 "
			+ "98.713,499.295 159.102,313.435 "
			+ '1,198.566 196.426,198.566 "/>' + "</svg>";
	var n = {
		starWidth : "32px",
		normalFill : "gray",
		ratedFill : "#f39c12",
		numStars : 5,
		maxValue : 5,
		precision : 1,
		rating : 0,
		fullStar : false,
		halfStar : false,
		readOnly : false,
		spacing : "0px",
		multiColor : null,
		onInit : null,
		onChange : null,
		onSet : null
	};
	var e = {
		startColor : "#c0392b",
		endColor : "#f1c40f"
	};
	function a(r, t, n) {
		if (r === t) {
			r = t
		} else if (r === n) {
			r = n
		}
		return r
	}
	function i(r, t, n) {
		var e = r >= t && r <= n;
		if (!e) {
			throw Error("Invalid Rating, expected value between " + t + " and "
					+ n)
		}
		return r
	}
	function o(r) {
		return typeof r !== "undefined"
	}
	var l = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i;
	var s = function(r) {
		if (!l.test(r)) {
			return null
		}
		var t = l.exec(r), n = parseInt(t[1], 16), e = parseInt(t[2], 16), a = parseInt(
				t[3], 16);
		return {
			r : n,
			g : e,
			b : a
		}
	};
	function f(r, t, n) {
		var e = (t - r) * (n / 100);
		e = Math.round(r + e).toString(16);
		if (e.length === 1) {
			e = "0" + e
		}
		return e
	}
	function u(r, t, n) {
		if (!r || !t) {
			return null
		}
		n = o(n) ? n : 0;
		r = s(r);
		t = s(t);
		var e = f(r.r, t.r, n), a = f(r.b, t.b, n), i = f(r.g, t.g, n);
		return "#" + e + i + a
	}
	function c(n, l) {
		this.node = n.get(0);
		var s = this;
		n.empty().addClass("jq-ry-container");
		var f = r("<div/>").addClass("jq-ry-group-wrapper").appendTo(n);
		var p = r("<div/>").addClass("jq-ry-normal-group").addClass(
				"jq-ry-group").appendTo(f);
		var g = r("<div/>").addClass("jq-ry-rated-group").addClass(
				"jq-ry-group").appendTo(f);
		var d, v, y, m, x, w, C = 0;
		var S = l.rating;
		var b = false;
		function F(r) {
			if (!o(r)) {
				r = l.rating
			}
			S = r;
			var t = r / d;
			var n = t * y;
			if (t > 1) {
				n += (Math.ceil(t) - 1) * x
			}
			E(l.ratedFill);
			g.css("width", n + "%")
		}
		function k() {
			w = v * l.numStars + m * (l.numStars - 1);
			y = v / w * 100;
			x = m / w * 100;
			n.width(w);
			F()
		}
		function I(r) {
			var t = l.starWidth = r;
			v = window.parseFloat(l.starWidth.replace("px", ""));
			p.find("svg").attr({
				width : l.starWidth,
				height : t
			});
			g.find("svg").attr({
				width : l.starWidth,
				height : t
			});
			k();
			return n
		}
		function V(r) {
			l.spacing = r;
			m = parseFloat(l.spacing.replace("px", ""));
			p.find("svg:not(:first-child)").css({
				"margin-left" : r
			});
			g.find("svg:not(:first-child)").css({
				"margin-left" : r
			});
			k();
			return n
		}
		function j(r) {
			l.normalFill = r;
			p.find("svg").attr({
				fill : l.normalFill
			});
			return n
		}
		var q = l.ratedFill;
		function E(r) {
			if (l.multiColor) {
				var t = S - C, a = t / l.maxValue * 100;
				var i = l.multiColor || {}, o = i.startColor || e.startColor, s = i.endColor
						|| e.endColor;
				r = u(o, s, a)
			} else {
				q = r
			}
			l.ratedFill = r;
			g.find("svg").attr({
				fill : l.ratedFill
			});
			return n
		}
		function W(r) {
			l.multiColor = r;
			E(r ? r : q)
		}
		function A(e) {
			l.numStars = e;
			d = l.maxValue / l.numStars;
			p.empty();
			g.empty();
			for (var a = 0; a < l.numStars; a++) {
				p.append(r(t));
				g.append(r(t))
			}
			I(l.starWidth);
			j(l.normalFill);
			V(l.spacing);
			F();
			return n
		}
		function M(r) {
			l.maxValue = r;
			d = l.maxValue / l.numStars;
			if (l.rating > r) {
				B(r)
			}
			F();
			return n
		}
		function O(r) {
			l.precision = r;
			B(l.rating);
			return n
		}
		function T(r) {
			l.halfStar = r;
			return n
		}
		function R(r) {
			l.fullStar = r;
			return n
		}
		function Y(r) {
			var t = r % d, n = d / 2, e = l.halfStar, a = l.fullStar;
			if (!a && !e) {
				return r
			}
			if (a || e && t > n) {
				r += d - t
			} else {
				r = r - t;
				if (t > 0) {
					r += n
				}
			}
			return r
		}
		function $(r) {
			var t = p.offset(), n = t.left, e = n + p.width();
			var a = l.maxValue;
			var i = r.pageX;
			var o = 0;
			if (i < n) {
				o = C
			} else if (i > e) {
				o = a
			} else {
				var s = (i - n) / (e - n);
				if (m > 0) {
					s *= 100;
					var f = s;
					while (f > 0) {
						if (f > y) {
							o += d;
							f -= y + x
						} else {
							o += f / y * d;
							f = 0
						}
					}
				} else {
					o = s * l.maxValue
				}
				o = Y(o)
			}
			return o
		}
		function z(r) {
			l.readOnly = r;
			n.attr("readonly", true);
			U();
			if (!r) {
				n.removeAttr("readonly");
				P()
			}
			return n
		}
		function B(r) {
			var t = r;
			var e = l.maxValue;
			if (typeof t === "string") {
				if (t[t.length - 1] === "%") {
					t = t.substr(0, t.length - 1);
					e = 100;
					M(e)
				}
				t = parseFloat(t)
			}
			i(t, C, e);
			t = parseFloat(t.toFixed(l.precision));
			a(parseFloat(t), C, e);
			l.rating = t;
			F();
			if (b) {
				n.trigger("rateyo.set", {
					rating : t
				})
			}
			return n
		}
		function N(r) {
			l.onInit = r;
			return n
		}
		function Q(r) {
			l.onSet = r;
			return n
		}
		function X(r) {
			l.onChange = r;
			return n
		}
		this.rating = function(r) {
			if (!o(r)) {
				return l.rating
			}
			B(r);
			return n
		};
		this.destroy = function() {
			if (!l.readOnly) {
				U()
			}
			c.prototype.collection = h(n.get(0), this.collection);
			n.removeClass("jq-ry-container").children().remove();
			return n
		};
		this.method = function(r) {
			if (!r) {
				throw Error("Method name not specified!")
			}
			if (!o(this[r])) {
				throw Error("Method " + r + " doesn't exist!")
			}
			var t = Array.prototype.slice.apply(arguments, []), n = t.slice(1), e = this[r];
			return e.apply(this, n)
		};
		this.option = function(r, t) {
			if (!o(r)) {
				return l
			}
			var n;
			switch (r) {
			case "starWidth":
				n = I;
				break;
			case "numStars":
				n = A;
				break;
			case "normalFill":
				n = j;
				break;
			case "ratedFill":
				n = E;
				break;
			case "multiColor":
				n = W;
				break;
			case "maxValue":
				n = M;
				break;
			case "precision":
				n = O;
				break;
			case "rating":
				n = B;
				break;
			case "halfStar":
				n = T;
				break;
			case "fullStar":
				n = R;
				break;
			case "readOnly":
				n = z;
				break;
			case "spacing":
				n = V;
				break;
			case "onInit":
				n = N;
				break;
			case "onSet":
				n = Q;
				break;
			case "onChange":
				n = X;
				break;
			default:
				throw Error("No such option as " + r)
			}
			return o(t) ? n(t) : l[r]
		};
		function D(r) {
			var t = $(r).toFixed(l.precision);
			var e = l.maxValue;
			t = a(parseFloat(t), C, e);
			F(t);
			n.trigger("rateyo.change", {
				rating : t
			})
		}
		function G() {
			F();
			n.trigger("rateyo.change", {
				rating : l.rating
			})
		}
		function H(r) {
			var t = $(r).toFixed(l.precision);
			t = parseFloat(t);
			s.rating(t)
		}
		function J(r, t) {
			if (l.onInit && typeof l.onInit === "function") {
				l.onInit.apply(this, [ t.rating, s ])
			}
		}
		function K(r, t) {
			if (l.onChange && typeof l.onChange === "function") {
				l.onChange.apply(this, [ t.rating, s ])
			}
		}
		function L(r, t) {
			if (l.onSet && typeof l.onSet === "function") {
				l.onSet.apply(this, [ t.rating, s ])
			}
		}
		function P() {
			n.on("mousemove", D).on("mouseenter", D).on("mouseleave", G).on(
					"click", H).on("rateyo.init", J).on("rateyo.change", K).on(
					"rateyo.set", L)
		}
		function U() {
			n.off("mousemove", D).off("mouseenter", D).off("mouseleave", G)
					.off("click", H).off("rateyo.init", J).off("rateyo.change",
							K).off("rateyo.set", L)
		}
		A(l.numStars);
		z(l.readOnly);
		this.collection.push(this);
		this.rating(l.rating, true);
		b = true;
		n.trigger("rateyo.init", {
			rating : l.rating
		})
	}
	c.prototype.collection = [];
	function p(t, n) {
		var e;
		r.each(n, function() {
			if (t === this.node) {
				e = this;
				return false
			}
		});
		return e
	}
	function h(t, n) {
		r.each(n, function(r) {
			if (t === this.node) {
				var e = n.slice(0, r), a = n.slice(r + 1, n.length);
				n = e.concat(a);
				return false
			}
		});
		return n
	}
	function g(t) {
		var e = c.prototype.collection;
		var a = r(this);
		if (a.length === 0) {
			return a
		}
		var i = Array.prototype.slice.apply(arguments, []);
		if (i.length === 0) {
			t = i[0] = {}
		} else if (i.length === 1 && typeof i[0] === "object") {
			t = i[0]
		} else if (i.length >= 1 && typeof i[0] === "string") {
			var o = i[0], l = i.slice(1);
			var s = [];
			r
					.each(
							a,
							function(r, t) {
								var n = p(t, e);
								if (!n) {
									throw Error("Trying to set options before even initialization")
								}
								var a = n[o];
								if (!a) {
									throw Error("Method " + o
											+ " does not exist!")
								}
								var i = a.apply(n, l);
								s.push(i)
							});
			s = s.length === 1 ? s[0] : s;
			return s
		} else {
			throw Error("Invalid Arguments")
		}
		t = r.extend({}, n, t);
		return r.each(a, function() {
			var n = p(this, e);
			if (!n) {
				return new c(r(this), r.extend({}, t))
			}
		})
	}
	function d() {
		return g.apply(this, Array.prototype.slice.apply(arguments, []))
	}
	window.RateYo = c;
	r.fn.rateYo = d
})($ || window.jQuery);
;
