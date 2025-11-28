frappe.pages['main-onboarding'].on_page_load = function (wrapper) {

	const page = frappe.ui.make_app_page({
		parent: wrapper,
		single_column: true
	});

	let container = $('<div class="onboard-wrap"></div>').appendTo(page.main);

	frappe.call({
		method: 'sccc_theme.utils.main_onboarding.get_onboarding_page',
		callback: function (r) {
			if (!r.message) {
				container.html('<p>No onboarding data found</p>');
				return;
			}

			const data = r.message;
			container.html(data.html);

			const steps = [...data.mandatory_steps, ...data.optional_steps];

			// =============== STEP LOCKING LOGIC ==================
			let unlockedIndex = steps.findIndex(s => !s.completed);
			if (unlockedIndex === -1) unlockedIndex = steps.length - 1; // all done

			showStepDescription(steps[0]);

			renderSteps(data, steps);

			$(".step-row").on("click", function () {
				const index = $(this).data("index");

				// USER CANNOT CLICK A LOCKED STEP
				if (index > unlockedIndex) {
					frappe.msgprint({
						title: "Complete previous step",
						message: "You must finish earlier steps before continuing.",
						indicator: "red"
					});
					return;
				}

				// change description
				showStepDescription(steps[index]);

				// Update active UI
				$(".step-row").removeClass("active");
				$(this).addClass("active");
			});

			// PROGRESS BAR
			const P = (data.completed_steps / data.total_steps) * 100;
			$("#progress-inner").css("width", `${P}%`);
			$("#progress-text").text(`${data.completed_steps}/${data.total_steps} steps completed`);
		}
	});

	function renderSteps(data, steps) {

		let mandatoryHtml = "";
		let optionalHtml = "";

		data.mandatory_steps.forEach((step, i) => {
			mandatoryHtml += renderStep(step, i);
		});
		data.optional_steps.forEach((step, i) => {
			optionalHtml += renderStep(step, data.mandatory_steps.length + i);
		});

		$("#mandatory-list").html(mandatoryHtml);
		$("#optional-list").html(optionalHtml);
	}

	function renderStep(step, index) {
		return `
			<div class="step-row ${step.completed ? 'done' : ''}" data-index="${index}">
				<div class="checkbox">${step.completed ? '✔' : ''}</div>
				<span>${step.step}</span>
			</div>`;
	}

	function showStepDescription(step) {
		$("#desc-title").text(step.step);
		$("#desc-content").text(step.description);

		const label = step.step.toLowerCase().includes("chart") ?
			"view chart of account" :
			step.completed ? "Completed" : "Continue";

		$("#desc-button").text(label);
	}
};
