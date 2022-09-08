exports.process = function (model, parameters) {
    model.entities.forEach(e => {
        e.properties.forEach(p => {
            p.dataNotNull = p.dataNullable === "false";
            p.dataAutoIncrement = p.dataAutoIncrement === "true";
            p.dataNullable = p.dataNullable === "true";
            p.dataPrimaryKey = p.dataPrimaryKey === "true";
            p.dataUnique = p.dataUnique === "true";
            p.isCalculatedProperty = p.isCalculatedProperty === "true";
            p.widgetIsMajor = p.widgetIsMajor === "true";
            p.widgetLabel = p.widgetLabel ? p.widgetLabel : p.name;

            if (p.dataPrimaryKey) {
                if (e.primaryKeys === undefined) {
                    e.primaryKeys = [];
                }
                e.primaryKeys.push(p.name);
                e.primaryKeysString = e.primaryKeys.join(", ");
            }
            if (p.relationshipType === "COMPOSITION" && p.relationshipCardinality === "1_n") {
                e.masterEntity = p.relationshipEntityName;
                e.masterEntityId = p.name;
                p.widgetIsMajor = false;
                // e.masterEntityPrimaryKey = model.entities.filter(m => m.name === e.masterEntity)[0].properties.filter(k => k.dataPrimaryKey)[0].name;
            }

            if (p.widgetType == "DROPDOWN") {
                e.hasDropdowns = true;
            }
            if (p.dataType === "CHAR" || p.dataType === "VARCHAR") {
                // TODO minLength is not available in the model and can't be determined
                p.minLength = 0;
                p.maxLength = -1;
                let widgetLength = parseInt(p.widgetLength);
                let dataLength = parseInt(p.dataLength)
                p.maxLength = dataLength > widgetLength ? widgetLength : dataLength;
            } else if (p.dataType === "DATE" || p.dataType === "TIME" || p.dataType === "TIMESTAMP") {
                p.isDateType = true;
                e.hasDates = true;
            }
            p.inputRule = p.widgetPattern ? p.widgetPattern : "";

            if (e.layoutType === "MANAGE_MASTER" && p.widgetIsMajor) {
                if (e.masterProperties == null) {
                    e.masterProperties = {
                        title: null,
                        properties: []
                    };
                }
                if (!p.dataAutoIncrement) {
                    if (e.masterProperties.title == null) {
                        e.masterProperties.title = p;
                    } else {
                        e.masterProperties.properties.push(p);
                    }
                }
            }
        });
    });

    parameters.perspectives = {};

    model.entities.forEach(e => {
        if (e.perspectiveName) {
            if (parameters.perspectives[e.perspectiveName] == null) {
                parameters.perspectives[e.perspectiveName] = {
                    views: []
                };
            }
            parameters.perspectives[e.perspectiveName].name = e.perspectiveName;
            parameters.perspectives[e.perspectiveName].label = e.perspectiveName;
            parameters.perspectives[e.perspectiveName].order = e.perspectiveOrder;
            parameters.perspectives[e.perspectiveName].icon = e.perspectiveIcon;
            parameters.perspectives[e.perspectiveName].views.push(e.name);
        }
    });
}