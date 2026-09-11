/*
 * M&H Pressing — front-end behaviour.
 *
 * Deliberately small. Everything on this site is readable, navigable and
 * submittable with JavaScript disabled; this file only improves what is
 * already there. It is the inverse of the old site, where JS built the page.
 *
 *  1. Mobile navigation
 *  2. Booking form: save the lead first, then hand off to WhatsApp
 */

(function () {
	'use strict';

	var cfg = window.MH || {};

	/* ── 1. Mobile navigation ───────────────────────────────────────── */

	var burger = document.querySelector('[data-mh-burger]');
	var drawer = document.getElementById('mobile-nav');

	if (burger && drawer) {
		burger.addEventListener('click', function () {
			var open = burger.getAttribute('aria-expanded') === 'true';
			burger.setAttribute('aria-expanded', String(!open));
			drawer.classList.toggle('is-open', !open);
		});

		// Close after following an in-page anchor, or the drawer covers the target.
		drawer.addEventListener('click', function (e) {
			if (e.target.closest('a')) {
				burger.setAttribute('aria-expanded', 'false');
				drawer.classList.remove('is-open');
			}
		});

		document.addEventListener('keydown', function (e) {
			if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
				burger.setAttribute('aria-expanded', 'false');
				drawer.classList.remove('is-open');
				burger.focus();
			}
		});
	}

	/* ── 2. Booking form ────────────────────────────────────────────── */

	var form = document.querySelector('[data-mh-booking]');
	if (!form || !cfg.restUrl) {
		return;
	}

	var button = form.querySelector('[data-mh-submit]');
	var label  = form.querySelector('[data-mh-submit-label]');
	var status = form.querySelector('[data-mh-status]');
	var busy   = false;

	function say(message, kind) {
		if (!status) { return; }
		status.textContent = message;
		status.className = 'form__status is-visible form__status--' + kind;
	}

	function setBusy(state) {
		busy = state;
		if (button) { button.disabled = state; }
		if (label)  { label.textContent = state ? cfg.i18n.sending : cfg.i18n.submit; }
	}

	form.addEventListener('submit', function (e) {
		e.preventDefault();
		if (busy) { return; }

		if (!form.reportValidity()) { return; }

		var data = new FormData(form);
		var payload = {
			name:    data.get('name')    || '',
			phone:   data.get('phone')   || '',
			area:    data.get('area')    || '',
			zone:    data.get('zone')    || '',
			express: data.get('express') ? '1' : '',
			address: data.get('address') || '',
			date:    data.get('date')    || '',
			time:    data.get('time')    || '',
			notes:   data.get('notes')   || '',
			website: data.get('website') || '',
			lang:    data.get('lang')    || cfg.lang,
			types:   data.getAll('types[]')
		};

		setBusy(true);

		/*
		 * Open the WhatsApp tab synchronously inside the submit gesture.
		 * Opening it later, in the fetch callback, loses the user-activation
		 * token and mobile Safari blocks it as a popup — which is exactly how
		 * the old site lost leads. We point the tab at its destination once the
		 * save returns, and close it if the save failed.
		 */
		var waTab = window.open('', '_blank');

		fetch(cfg.restUrl, {
			method: 'POST',
			credentials: 'same-origin',
			headers: {
				'Content-Type': 'application/json',
				'X-WP-Nonce': cfg.nonce
			},
			body: JSON.stringify(payload)
		})
			.then(function (res) {
				return res.json().then(function (body) {
					return { ok: res.ok, body: body };
				});
			})
			.then(function (result) {
				if (!result.ok) {
					throw new Error((result.body && result.body.message) || 'save_failed');
				}

				say(cfg.i18n.ok, 'ok');
				form.reset();

				var url = (result.body && result.body.whatsapp) || cfg.whatsapp;
				if (waTab && !waTab.closed) {
					waTab.location = url;
				} else {
					// Popup was blocked. The lead is already saved, so tell the
					// customer that and give them the phone number.
					say(cfg.i18n.saved, 'ok');
				}
			})
			.catch(function () {
				// The save failed, so do not pretend it worked.
				if (waTab && !waTab.closed) { waTab.close(); }
				say(cfg.i18n.error, 'error');
			})
			.finally(function () {
				setBusy(false);
			});
	});
})();
