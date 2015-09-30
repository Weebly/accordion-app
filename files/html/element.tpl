<div class="accordion accordion--{{style}}">
    {{#items_each}} 
        <div class="accordion__item">
            <div class="accordion__title">
                <span>{title_{{items_index}}:text default="title {{items_index}}"}<span>
            </div>
            <div class="accordion__content">
                <div style="padding: 10px 20px 20px;">
                    {content_{{items_index}}:content}
                </div>
            </div>
        </div>
    {{/items_each}}
</div>