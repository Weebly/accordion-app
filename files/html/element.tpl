<div class="accordion {{theme}}">
	<ul class="accordion-ul">
	{{#items_each}}	
		<li class="accordion-li">
			<div class="accordion-item-title">
				{title_{{items_index}}:text default="title {{items_index}}"}
			</div>
			<div class="accordion-item-content">
				{content_{{items_index}}:text default=""}
			</div>
		</li>
	{{/items_each}}
	</ul>
</div>