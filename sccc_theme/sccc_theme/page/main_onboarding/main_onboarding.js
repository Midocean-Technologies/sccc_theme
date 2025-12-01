frappe.pages['main-onboarding'].on_page_load = function (wrapper) {

	let currentStep = null;
	let steps = [];

	const page = frappe.ui.make_app_page({
		parent: wrapper,
		single_column: true
	});

	let container = $('<div class="onboard-wrap"></div>').appendTo(page.main);

	// =========================
	// LOAD DATA
	// =========================
	frappe.call({
		method: "sccc_theme.utils.main_onboarding.get_onboarding_page",
		callback: function (r) {

			const data = r.message;
			container.html(data.html);

			steps = [...data.mandatory_steps, ...data.optional_steps];

			// STEP 1: check if mandatory finished
			checkMandatory(data);

			// STEP 2: find first incomplete step
			currentStep = steps.find(s => !s.completed) || steps[0];

			showStep(currentStep);
			renderList(data);
			highlight(currentStep);

			$(".step-row").on("click", function () {
				const s = steps[$(this).data("index")];

				if (s.completed) return;
				currentStep = s;
				showStep(s);
				highlight(s);
			});

			updateProgress(data);

			// Continue
			$("#desc-button").on("click", function () {
				if (currentStep.completed) return;
				openStep(currentStep);
			});

			// Skip (optional only)
			$("#skip-button").on("click", function () {
				skipStep(currentStep);
			});
		}
	});

	// ================================
	// CORE FUNCTIONS
	// ================================

	function checkMandatory(data) {
		const incomplete = data.mandatory_steps.filter(x => !x.completed);
		if (incomplete.length === 0 && data.mandatory_steps.length > 0) {
			// go to optional steps
			return;
		}
	}

	function skipStep(step) {

		if (step.mandatory) {
			frappe.msgprint("You cannot skip a required step.");
			return;
		}

		const index = steps.indexOf(step);
		const next = steps[index + 1];

		if (next) {
			currentStep = next;
			showStep(next);
			highlight(next);
		} else {
			// last optional
			window.location.href = "/app/home";
		}
	}

	function highlight(step) {
		$(".step-row").removeClass("active");
		$(`.step-row[data-step="${step.step}"]`).addClass("active");
	}

	function updateProgress(data) {
		let val = (data.completed_steps / data.total_steps) * 100;
		$("#progress-inner").css("width", val + "%");
		$("#progress-text").text(`${data.completed_steps}/${data.total_steps} steps completed`);
	}

	// =========================
	// MODAL OPEN
	// =========================
	function openStep(step) {

		if (!step.route) {
			frappe.msgprint("No page defined for this step.");
			return;
		}

		const dialog = new frappe.ui.Dialog({
			title: step.step,
			fields: [],
			primary_action_label: __("Save"),
			primary_action: function () {
				complete(step.step, dialog);
			},
			secondary_action_label: __("Cancel"),
			secondary_action: () => dialog.hide(),
		});

		const frame = $(
			`<iframe src="${step.route}" style="width:760px;height:360px;border:0;"
			sandbox="allow-same-origin allow-scripts allow-forms allow-popups"></iframe>`
		);

		$(dialog.body).empty().append(frame);
		dialog.show();
	}

	// =========================
	// MARK COMPLETE
	// =========================
	function complete(stepName, dialog) {
		frappe.call({
			method: "sccc_theme.utils.main_onboarding.mark_step_completed",
			args: { step: stepName },
			callback: function () {
				dialog.hide();

				const index = steps.findIndex(s => s.step === stepName);
				const next = steps[index + 1];

				// If no next step → redirect
				if (!next) {
					window.location.href = "/app/home";
					return;
				}

				// Go to next
				currentStep = next;
				location.reload();
			}
		});
	}

	// =========================
	// UI BUILDING
	// =========================
	function renderList(data) {
		let req = "", opt = "";

		data.mandatory_steps.forEach((s, i) => {
			req += htmlStep(s, i, true);
		});

		data.optional_steps.forEach((s, i) => {
			opt += htmlStep(s, data.mandatory_steps.length + i, false);
		});

		$("#mandatory-list").html(req);
		$("#optional-list").html(opt);
	}

	function htmlStep(step, idx, isMandatory) {
		const star = isMandatory ? '<span class="mandatory-star">*</span>' : '';

		return `
		<div class="step-row ${step.completed ? "done" : ""}"
			data-step="${step.step}"
			data-index="${idx}">
			<div class="checkbox">${step.completed ? "✔" : ""}</div>
			<span class="step-number">${idx + 1}.</span>
			<span class="step-label">${step.step}${star}</span>
			<span class="step-arrow">&rsaquo;</span>
		</div>`;
	}

	function showStep(step) {
		$("#desc-title").text(step.step);
		$("#desc-content").text(step.description);

		// Show buttons based on optional/mandatory
		if (step.mandatory) {
			$("#skip-button").hide();
			$("#desc-button").text("Continue");
		} else {
			$("#skip-button").show();
			$("#desc-button").text("Continue");
		}
	}
};
