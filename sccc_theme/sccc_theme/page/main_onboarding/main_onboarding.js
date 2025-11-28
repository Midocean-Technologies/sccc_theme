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

			// combine lists
			const steps = [...data.mandatory_steps, ...data.optional_steps];

			// default select first step
			showStepDescription(steps[0]);

			let mandatoryHtml = "";
			let optionalHtml = "";

			data.mandatory_steps.forEach((step, i) => {
				mandatoryHtml += `
					<div class="step-row ${step.completed ? 'done' : ''}" data-index="${i}">
						<div class="checkbox">${step.completed ? '✔' : ''}</div>
						<span>${step.step}</span>
					</div>`;
			});

			data.optional_steps.forEach((step, i) => {
				const idx = data.mandatory_steps.length + i;
				optionalHtml += `
					<div class="step-row ${step.completed ? 'done' : ''}" data-index="${idx}">
						<div class="checkbox">${step.completed ? '✔' : ''}</div>
						<span>${step.step}</span>
					</div>`;
			});

			$("#mandatory-list").html(mandatoryHtml);
			$("#optional-list").html(optionalHtml);

			// Click actions
			$(".step-row").on("click", function () {
				const index = $(this).data("index");
				showStepDescription(steps[index]);

				$(".step-row").removeClass("active");
				$(this).addClass("active");
			});

			// Progress bar
			const p = data.total_steps > 0 ? (data.completed_steps / data.total_steps) * 100 : 0;
			$("#progress-inner").css("width", `${p}%`);
			$("#progress-text").text(`${data.completed_steps}/${data.total_steps} steps completed`);
		}
	});

	function showStepDescription(step) {
		$("#desc-title").text(step.step);
		$("#desc-content").text(step.description);

		if (step.step.toLowerCase().includes("chart"))
			$("#desc-button").text("view chart of account");
		else
			$("#desc-button").text(step.completed ? "Completed" : "Continue");
	}
};
