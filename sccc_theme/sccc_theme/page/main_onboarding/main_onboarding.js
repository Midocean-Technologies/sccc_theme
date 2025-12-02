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

			checkMandatory(data);

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

			$("#desc-button").on("click", function () {
				if (currentStep.completed) return;
				openStep(currentStep);
			});

			$("#skip-button").on("click", function () {
				skipStep(currentStep);
			});
		}
	});

	// MANDATORY CHECK
	function checkMandatory(data) {
		const incomplete = data.mandatory_steps.filter(x => !x.completed);
		if (incomplete.length === 0 && data.mandatory_steps.length > 0) {
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
			window.location.href = "/app/home";
		}
	}

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
		if (step.route === "Tree/Account") {
			openAccountTree(step);
			return;
		}

		// fallback: open in iframe dialog
		openIframeDialog(step);
	}

	function openIframeDialog(step) {
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

		const frame = $(`
			<iframe src="${step.route}" style="width:760px;height:360px;border:0;"
				sandbox="allow-same-origin allow-scripts allow-forms allow-popups">
			</iframe>
		`);

		$(dialog.body).empty().append(frame);
		dialog.show();
	}

	//  ACCOUNT TREE IN DIALOG
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

		let tree = createAccountTree(wrapper, company);
	}

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


	//  ADD CHILD ()
	function show_add_child_dialog(node, company, tree) {
		console.log("Adding child to:", node, company);

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
							root_type: values.root_type,
							company: company
						}
					},
					callback: function (res) {
						// ✅ now tree really is a frappe.ui.Tree instance
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

				const index = steps.findIndex(s => s.step === stepName);
				const next = steps[index + 1];

				if (!next) {
					window.location.href = "/app/home";
					return;
				}

				currentStep = next;
				location.reload();
			}
		});
	}

	// STEP LIST DESIGN
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

	// SHOW STEP + TEXT
	function showStep(step) {
		$("#desc-title").text(step.step);
		$("#desc-content").text(step.description);
		$("#step-type-text").text(step.mandatory ? "Required" : "Skip");

		if (step.mandatory) {
			$("#skip-button").hide();
			$("#desc-button").text("Continue");
		} else {
			$("#skip-button").show();
			$("#desc-button").text("Continue");
		}
	}
};
