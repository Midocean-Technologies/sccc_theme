frappe.pages['main-onboarding'].on_page_load = function (wrapper) {

	let currentStep = null;
	let steps = [];

	const page = frappe.ui.make_app_page({
		parent: wrapper,
		single_column: true
	});

	let container = $('<div class="onboard-wrap"></div>').appendTo(page.main);

	// LOAD DATA
	frappe.call({
		method: "sccc_theme.sccc_theme.page.main_onboarding.main_onboarding.get_onboarding_page",
		callback: function (r) {

			const data = r.message;
			container.html(data.html);

			steps = [...data.mandatory_steps, ...data.optional_steps];

			currentStep = steps.find(s => s.completed == 0) || steps[0];

			showStep(currentStep);
			renderList(data);
			highlight(currentStep);

			$(".step-row").on("click", function () {
				const s = steps[$(this).data("index")];
				if (s.completed == 1) return;
				currentStep = s;
				showStep(s);
				highlight(s);
			});

			updateProgress(data);

			$("#desc-button").on("click", function () {
				if (currentStep.completed == 1) return;
				openStep(currentStep);
			});
		}
	});

	// ---------------------------
	// SKIP BUTTON LOGIC (NEW)
	// ---------------------------
	$(document).on("click", "#step-type-button", function () {

		// If CURRENT step is mandatory → block
		if (currentStep && currentStep.mandatory == 1) {
			frappe.msgprint("This is a required step. Please complete it.");
			return;
		}

		// Check if ANY mandatory step is incomplete
		let mandatory_incomplete = steps
			.filter(s => s.mandatory == 1)
			.some(s => s.completed == 0);

		if (mandatory_incomplete) {
			frappe.msgprint("Please complete all required steps before skipping.");
			return;
		}

		// All mandatory steps completed → go home
		window.location.href = "/app/home";
	});

	// ---------------------------
	// HELPER FUNCTIONS
	// ---------------------------

	function highlight(step) {
		$(".step-row").removeClass("active");
		$(`.step-row[data-step="${step.step}"]`).addClass("active");
	}

	function updateProgress(data) {
		let ratio = (data.completed_steps / data.total_steps) * 100;
		$("#progress-inner").css("width", ratio + "%");
		$("#progress-text").text(`${data.completed_steps}/${data.total_steps} steps completed`);
	}

	// OPEN STEP
	function openStep(step) {
		if (!step.route) {
			frappe.msgprint("No page defined for this step.");
			return;
		}

		// special case: chart of accounts
		if (step.route.toLowerCase() === "tree/account") {
			openAccountTree(step);
			return;
		}

		openBlankDialog(step);
	}

	function openBlankDialog(step) {

		const dialog = new frappe.ui.Dialog({
			title: step.step,
			size: "extra-large",
			fields: [
				{
					fieldtype: "HTML",
					fieldname: "info_box",
					options: `<div style="padding:20px;font-size:16px;"></div>`
				}
			],
			primary_action_label: __("Done"),
			primary_action: function () {
				complete(step.step, dialog);
			},
			secondary_action_label: __("Close"),
			secondary_action: () => dialog.hide(),
		});

		dialog.show();
	}

	// CHART OF ACCOUNT
	function openAccountTree(step) {
		const dialog = new frappe.ui.Dialog({
			title: __("Chart of Accounts"),
			size: "extra-large",
			fields: [
				{
					fieldtype: "HTML",
					fieldname: "account_tree",
				}
			],
			primary_action_label: __("Done"),
			primary_action: function () {
				complete(step.step, dialog);
			},
			secondary_action_label: __("Cancel"),
			secondary_action: () => dialog.hide(),
		});

		dialog.show();

		let wrapper = dialog.get_field("account_tree").$wrapper[0];
		let company = frappe.defaults.get_default("company");

		createAccountTree(wrapper, company);
	}

	// function createAccountTree(wrapper, company) {
	// 	return new frappe.ui.Tree({
	// 		parent: wrapper,
	// 		label: __("Accounts"),
	// 		root_label: __("Accounts"),
	// 		expandable: true,
	// 		method: "erpnext.accounts.utils.get_children",
	// 		args: { doctype: "Account", company: company },
	// 	});
	// }
	function createAccountTree(wrapper, company) {
		let tree = new frappe.ui.Tree({
			parent: wrapper,
			label: __("Accounts"),
			root_label: __("Accounts"),
			expandable: true,
			method: "erpnext.accounts.utils.get_children",
			args: { doctype: "Account", company: company },

			toolbar: [
				{
					label: __("Add Child"),
					condition(node) { return node.expandable; },
					click(node) {
						show_add_child_dialog(node, company, tree);
					}
				},
				{
					label: __("Rename"),
					condition(node) { return !node.root; },
					click(node) {
						show_rename_dialog(node, tree);
					}
				}
			],
		});

		return tree;
	}
	function show_add_child_dialog(node, company, tree) {

		const d = new frappe.ui.Dialog({
			title: __("Add Child Account"),
			fields: [
				{ fieldtype: "Data", fieldname: "account_name", label: __("Account Name"), reqd: 1 },
				{ fieldtype: "Check", fieldname: "is_group", label: __("Is Group"), default: 0 },
			],
			primary_action_label: __("Create"),
			primary_action(values) {

				const parent_account = node.data && node.data.value ? node.data.value : null;

				frappe.call({
					method: "frappe.client.insert",
					args: {
						doc: {
							doctype: "Account",
							account_name: values.account_name,
							is_group: values.is_group ? 1 : 0,
							parent_account: parent_account,
							company: company
						}
					},
					callback: function (res) {

						if (tree && typeof tree.expand_node === "function") {
							tree.expand_node(node);
						}
						if (tree && typeof tree.load_children === "function") {
							tree.load_children(node);
						}

						d.hide();

						frappe.show_alert({
							message: __("Account created successfully"),
							indicator: "green"
						});
					}
				});
			}
		});

		d.show();
	}

	// RENAME ACCOUNT
	function show_rename_dialog(node, tree) {
		const d = new frappe.ui.Dialog({
			title: __("Rename Account"),
			fields: [
				{
					fieldtype: "Data",
					fieldname: "new_name",
					label: __("New Account Name"),
					reqd: 1,
					default: node.label
				}
			],
			primary_action_label: __("Rename"),
			primary_action(values) {

				const old_name = node.data?.value;
				const new_name = values.new_name;

				if (!old_name) {
					frappe.msgprint("Invalid account selected.");
					return;
				}

				frappe.call({
					method: "sccc_theme.sccc_theme.page.main_onboarding.main_onboarding.rename_account",
					args: {
						old_name: old_name,
						new_name: new_name
					},
					freeze: true,
					callback: function () {
						d.hide();

						const parentNode = node.parent_node;

						setTimeout(() => {
							if (parentNode) {
								tree.expand_node(parentNode);
								tree.load_children(parentNode);
							}
						}, 400);

						frappe.show_alert({
							message: __("Account Renamed Successfully"),
							indicator: "green"
						});
					}
				});
			}
		});

		d.show();
	}


	// MARK COMPLETE
	function complete(stepName, dialog) {
		frappe.call({
			method: "sccc_theme.sccc_theme.page.main_onboarding.main_onboarding.mark_step_completed",
			args: { step: stepName },
			callback: function () {
				dialog.hide();
				location.reload();
			}
		});
	}

	// STEP LIST 
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
		<div class="step-row ${step.completed == 1 ? "done" : ""}"
			data-step="${step.step}"
			data-index="${idx}">
			<div class="checkbox">${step.completed == 1 ? "✔" : ""}</div>
			<span class="step-number">${idx + 1}.</span>
			<span class="step-label">${step.step}${star}</span>
			<span class="step-arrow">&rsaquo;</span>
		</div>`;
	}

	function showStep(step) {
		$("#desc-title").text(step.step);
		$("#desc-content").text(step.description);

		$("#step-type-button").text(step.mandatory == 1 ? "Required" : "Skip");

		$("#desc-button").text("Continue");
	}
};
