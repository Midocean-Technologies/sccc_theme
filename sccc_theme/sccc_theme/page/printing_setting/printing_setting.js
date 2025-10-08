frappe.pages['printing-setting'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'printing setting',
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
			<div class="config-card" data-route="Form,Print Format Builder">
				<i class="config-icon"><img src= "/files/FileJson.svg"></i>
				<div class="config-label">Print Format Builder</div>
			</div>

			<div class="config-card" data-route="Form,Print Style">
				<i class="config-icon"><img src= "/files/LayoutList.svg"></i>
				<div class="config-label">Print Style</div>
			</div>
			<div class="config-card" data-route="Form,Print Heading">
				<i class="config-icon"><img src= "/files/Heading.svg"></i>
				<div class="config-label">Print Heading</div>
			</div>
			<div class="config-card" data-route="Form,Letter Head">
				<i class="config-icon"><img src= "/files/Heading1.svg"></i>
				<div class="config-label">Letter Head</div>
			</div>
			<div class="config-card" data-route="Form,Address Template">
				<i class="config-icon"><img src= "/files/LayoutTemplate.svg"></i>
				<div class="config-label">Address Template</div>
			</div>
			<div class="config-card" data-route="Form,Terms And Conditions">
				<i class="config-icon"><img src= "/files/BadgeCheck.svg"></i>
				<div class="config-label">Terms And Conditions</div>
			</div>

			<div class="config-card" data-route="Form,Cheque Print Template">
				<i class="config-icon"><img src= "/files/FileSpreadsheet.svg"></i>
				<div class="config-label">Cheque Print Template</div>
			</div>
			<div class="config-card" data-route="Form,Print Settings">
				<i class="config-icon"><img src= "/files/Printer.svg"></i>
				<div class="config-label">Print Settings</div>
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
