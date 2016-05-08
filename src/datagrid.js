var cs = cs || {};

cs.datagrid = {};

cs.datagrid.data_ = [];

cs.datagrid.width = $(window).width()*2/3;

cs.datagrid.updateData = function() {

    cs.datagrid.data_ = [];

    cs.eventSource_.forEachFeature(function(feature){

        var properties = feature.getProperties();
        var attrs = {};
        for (var key in properties) {
            attrs[key] = cs.datatype.constructor(feature, key, properties[key]);
        }
        cs.datagrid.data_.push(attrs);
    });

    if (cs.datagrid.data_.length>0) {
        cs.datagrid.renderTable();
    }
};

cs.datagrid.renderTable = function() {
    cs.datagrid.table_ = $('<table>',{id:'datagridTable' ,class:'cs-datagrid-table display'});
    cs.datagrid.renderTableHeader();
};

cs.datagrid.renderTableHeader = function() {

    var thead = $('<thead>',{class:'cs-datagrid-thead'});
    var row = $('<tr>',{class:'cs-datagrid-tr'})
        .appendTo(thead);

    for (attr in cs.dgAttrs){
        $('<th>',{class:'cs-datagrid-tableHeaderItem'})
            .html(cs.dgAttrs[attr])
            .appendTo(row);
    }

    thead.appendTo(cs.datagrid.table_);
    cs.datagrid.renderTableItems();
};

cs.datagrid.renderTableItems = function() {

    var handleOnClick_ = function(evt){
        var featureId = evt.currentTarget.getAttribute('data-cs-featureId');
        var feature = cs.eventSource_.getFeatureById(featureId);
        cs.featureDetail(feature);
    };

    var renderRows_ = function(row) {
        var tableRow = $('<tr>',{class:'cs-datagrid-tableRow','data-cs-featureId':row.id.getValue()});
        for (var attr in cs.dgAttrs) {
            var key = cs.dgAttrs[attr];
            if (row[key]) {
                $('<td>',{class:'cs-datagrid-tableRowItem'})
                    .html(row[key].getDgValue())
                    .appendTo(tableRow);
            } else {
                $('<td>',{class:'cs-datagrid-tableRowItem'})
                    .html(cs.datatype.empty().getDgValue())
                    .appendTo(tableRow);
            }
        }
        tableRow.on('click',handleOnClick_);

        tableRow.appendTo(cs.datagrid.table_);
    };

    cs.datagrid.data_.forEach(renderRows_);
    cs.datagrid.showTable();
};


cs.datagrid.showTable = function() {
    cs.sideBar_.open('datagrid');
    cs.sideBar_.find('#datagridContent').empty().append(cs.datagrid.table_);
    cs.datagrid.table_.DataTable({"bPaginate": false});

};