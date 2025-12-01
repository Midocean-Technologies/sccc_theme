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

			// show Chart of Accounts modal when the button indicates "view chart"
			$("#desc-button").on("click", function () {
				const label = ($(this).text() || "").toLowerCase();
				if (label.includes("view chart")) {
					openCoaModal();
					return;
				}
				// other button actions can be handled here (e.g., Continue)
			});
		}
	});

	// Open Chart of Accounts modal (adapted from setup_wizard.charts_modal)
	function openCoaModal() {
		const country = frappe.defaults.get_default("country") || "";

		frappe.call({
			method: "erpnext.accounts.doctype.account.chart_of_accounts.chart_of_accounts.get_charts_for_country",
			args: { country: country, with_standard: true },
			callback: function (r) {
				const charts = r.message || [];
				if (!charts.length) {
					frappe.msgprint({ message: "No chart templates found for your country" });
					return;
				}

				let current = charts[0];
				let parent_label = "All Accounts";
				let coa_tree;

				const dialog = new frappe.ui.Dialog({
					title: current,
					fields: [
						{
							fieldname: "expand_all",
							label: "Expand All",
							fieldtype: "Button",
							click: function () {
								if (coa_tree) coa_tree.load_children(coa_tree.root_node, true);
							},
						},
						{
							fieldname: "collapse_all",
							label: "Collapse All",
							fieldtype: "Button",
							click: function () {
								if (!coa_tree) return;
								coa_tree
									.get_all_nodes(coa_tree.root_node.data.value, coa_tree.root_node.is_root)
									.then((data_list) => {
										data_list.map((d) => {
											coa_tree.toggle_node(coa_tree.nodes[d.parent]);
										});
									});
							},
						},
					],
				});

				const body = $(dialog.body);
				const selectRow = $(
					'<div style="margin-bottom:10px;"><select id="coa-select" style="width:100%;padding:6px;"></select></div>'
				);
				body.prepend(selectRow);
				const sel = selectRow.find("#coa-select");
				charts.forEach((ch) => sel.append(`<option value="${ch}">${ch}</option>`));
				sel.val(current);

				const treeContainer = $('<div class="coa-tree-container"></div>').appendTo(body);

				function renderTree(chart_name) {
					treeContainer.empty();
					coa_tree = new frappe.ui.Tree({
						parent: treeContainer,
						label: parent_label,
						expandable: true,
						method: "erpnext.accounts.utils.get_coa",
						args: {
							chart: chart_name,
							parent: parent_label,
							doctype: "Account",
						},
						onclick: function (node) {
							parent_label = node.value;
						},
					});
					coa_tree.load_children(coa_tree.root_node, true);
				}

				// initial render
				renderTree(current);

				// switch chart on select change
				sel.on("change", function () {
					current = $(this).val();
					dialog.set_title(current);
					renderTree(current);
				});

				// layout tweaks for buttons (same as setup_wizard)
				const form_container = $(dialog.body).find("form");
				const buttons = $(form_container).find(".frappe-control");
				form_container.addClass("flex");
				buttons.map((index, button) => {
					$(button).css({ "margin-right": "1em" });
				});

				dialog.show();
			},
		});
	}

	function renderSteps(data, steps) {

		let mandatoryHtml = "";
		let optionalHtml = "";

		// pass isMandatory flag so renderStep can add "*" for required steps
		data.mandatory_steps.forEach((step, i) => {
			mandatoryHtml += renderStep(step, i, true);
		});
		data.optional_steps.forEach((step, i) => {
			optionalHtml += renderStep(step, data.mandatory_steps.length + i, false);
		});

		$("#mandatory-list").html(mandatoryHtml);
		$("#optional-list").html(optionalHtml);
	}

	function renderStep(step, index, isMandatory) {
		// number: show step position (1., 2., ...)
		const numberLabel = `${index + 1}.`;
		// star for required steps only
		const star = isMandatory ? '<span class="mandatory-star">*</span>' : '';
		// right arrow (simple chevron to match figma)
		const arrow = '<span class="step-arrow" aria-hidden="true">&rsaquo;</span>';

		return `
			<div class="step-row ${step.completed ? 'done' : ''}" data-index="${index}">
				<div class="checkbox">${step.completed ? '✔' : ''}</div>
				<span class="step-number">${numberLabel}</span>
				<span class="step-label">${step.step}${star}</span>
				${arrow}
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
