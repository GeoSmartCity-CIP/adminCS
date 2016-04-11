var cs = cs || {};

cs.datagrid = {};

cs.datagrid.data_ = [];

cs.datagrid.attributes_ = [];

cs.datagrid.updateData = function() {
    cs.eventSource_.forEachFeature(function(feature){
        var properties = feature.getProperties();
        delete properties['location'];
        delete properties['geometry'];
        cs.datagrid.data_.push(properties);
    });

    if (cs.datagrid.data_.length>0) {
        cs.datagrid.attributes_ = Object.keys(cs.datagrid.data_[0]);
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

    for (attr in cs.datagrid.attributes_){
        $('<th>',{class:'cs-datagrid-tableHeaderItem'})
            .html(cs.datagrid.attributes_[attr])
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
        var tableRow = $('<tr>',{class:'cs-datagrid-tableRow','data-cs-featureId':row.id});
        for (var attr in cs.datagrid.attributes_) {

            var key = cs.datagrid.attributes_[attr];

            $('<td>',{class:'cs-datagrid-tableRowItem'})
                .html(row[key])
                .appendTo(tableRow)
        }
        tableRow.on('click',handleOnClick_);

        tableRow.appendTo(cs.datagrid.table_);
    };

    cs.datagrid.data_.forEach(renderRows_);
    cs.datagrid.showTable();
};


cs.datagrid.showTable = function() {
    cs.sideBar_.open('datagrid');
    cs.sideBar_.find('#datagrid').append(cs.datagrid.table_);
    cs.datagrid.table_.DataTable({"bPaginate": false});
};