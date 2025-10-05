frappe.pages['tools-page'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'tools',
		single_column: true
	});

	var html_content = `
	<style>
		.main {
			width: 100%;
			height: 708px;
			padding: 24px;
			border: 1px solid #ddd;
		}
		.config-grid {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
			gap: 50px;
			padding: 20px;
		}
		.config-card {
			width:169px;
			height: 160px;
			background: #fff;
			border: 1px solid #ddd;
			border-radius: 0px;
			text-align: left;
			padding: 4px 4px 5px 4px;
			cursor: pointer;
			transition: transform 0.3s ease, box-shadow 0.3s ease;
			color: #5c2a9d; /* purple text */
			display: flex;
			flex-direction: column;
			align-items: flex-start;
		}
		.config-card:hover {
			transform: scale(1.05);
			box-shadow: 0 4px 8px rgba(92, 42, 157, 0.3);
		}
		.config-icon {
			width: 32px;
			height: 32px;
			margin-bottom: 55px;
			fill:#4F008C !important;
			margin-left:10px;
			margin-top:10px;
		}
		.config-label {
			font-size: 14px;
			text-transform: lowercase;
			white-space: normal;
			word-wrap: break-word;
			color: #5c2a9d;
			margin-left:10px;
			margin-right:10px;
			margin-bottom:10px;
		}
	</style>
	<div class="main">
	<div class="config-grid">
		<div class="config-card" data-route="Form,Data Import">
			<i class="config-icon"><img src= "/files/notebook-purple.svg"></i>
			<div class="config-label">data import</div>
		</div>
		<div class="config-card" data-route="Form,Todo">
			<i class="config-icon"><img src= "/files/notebook-purple.svg"></i>
			<div class="config-label">todo</div>
		</div>
		<div class="config-card" data-route="Form,File">
			<i class="config-icon"><img src= "/files/notebook-purple.svg"></i>
			<div class="config-label">file</div>
		</div>
		<div class="config-card" data-route="Form,Assignment Rule">
			<i class="config-icon"><img src= "/files/notebook-purple.svg"></i>
			<div class="config-label">assignment rule</div>
		</div>
		<div class="config-card" data-route="Form,Note">
			<i class="config-icon"><img src= "/files/notebook-purple.svg"></i>
			<div class="config-label">Note</div>
		</div>
		<div class="config-card" data-route="Form,Calendar View">
			<i class="config-icon"><img src= "/files/notebook-purple.svg"></i>
			<div class="config-label">calender</div>
		</div>
		<div class="config-card" data-route="Form,Newsletter">
			<i class="config-icon"><img src= "/files/notebook-purple.svg"></i>
			<div class="config-label">Newsletter</div>
		</div>
		<div class="config-card" data-route="Form,Auto Repeat">
			<i class="config-icon"><img src= "/files/notebook-purple.svg"></i>
			<div class="config-label">Auto Repeat</div>
		</div>
		


	</div>
	</div>
	`;

	page.main.html(html_content);

	page.main.find('.config-card').on('click', function() {
		const route = $(this).data('route').split(',');
		frappe.set_route(route[0], route[1]);
	});
}
