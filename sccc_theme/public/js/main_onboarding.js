function loadOnboardingSteps() {
	frappe.call({
		method: 'sccc_theme.utils.main_onboarding.get_onboarding_data',
		callback: function(r) {
			if (r.message) {
				const data = r.message;
				
				// Render mandatory steps with numbering
				const mandatoryHtml = data.mandatory_steps.map((step, index) => {
					return `<div class="step-item ${step.completed ? 'completed' : ''}">
						<div style="display: flex; align-items: center; flex: 1;">
							<span class="step-number">${index + 1}.</span>
							<div class="step-content">
								<p class="step-name">${step.step}</p>
							</div>
						</div>
						<a class="step-action" onclick="navigateToStep('${step.route}')">
							${step.completed ? 'completed' : 'start'}
						</a>
					</div>`;
				}).join('');
				$('#mandatory-steps').html(mandatoryHtml);
				
				// Render optional steps with numbering
				const optionalHtml = data.optional_steps.map((step, index) => {
					return `<div class="step-item ${step.completed ? 'completed' : ''}">
						<div style="display: flex; align-items: center; flex: 1;">
							<span class="step-number">${data.mandatory_steps.length + index + 1}.</span>
							<div class="step-content">
								<p class="step-name">${step.step}</p>
							</div>
						</div>
						<a class="step-action" onclick="navigateToStep('${step.route}')">
							${step.completed ? 'completed' : 'start'}
						</a>
					</div>`;
				}).join('');
				$('#optional-steps').html(optionalHtml);
				
				// Update progress
				const progress = (data.completed_steps / data.total_steps) * 100;
				$('#progress-bar-inner').css('width', progress + '%');
				$('#progress-text').text(`${data.completed_steps}/${data.total_steps} steps completed`);
			}
		}
	});
}

function navigateToStep(route) {
	frappe.set_route(route);
}
