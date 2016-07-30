app.l('Loading spanish (es_es) strings.', 'Lang');

app.lang = {};

app.lang.strings = {
  appName: "GardeningTools",
  poweredBy: function() { // Powered by node, chrome and nodeWebkit (nw.js)
    let match = navigator.userAgent.match(/(Chrom[e|ium])\/([0-9]+)\./);
    return "Powered by Node.js " + process.versions.node + " "
      + match[1] + " " + match[2] + " " +
      "y NW.js " + process.versions['node-webkit'] + ".";
  },
  statistics: "Estadísticas",
  add: "Añadir",
  edit: "Editar",
  del: "Eliminar",
  parents: "Plantas",
  children: "Hijos",
  parent: "Planta",
  child: "Hijo",
  newM: "Nuevo",
  newF: "Nueva",
  save: "Guardar",
  load: "Cargar",
  changes: "Cambios",
  apply: "Aplicar",
  refresh: "Actualizar",
  update: "Actualizar",
  uuid: "UUID",
  inW: "Entrada",
  outW: "Salida",
  date: "Fecha",
  height: "Altura",
  quality: "Calidad",
  production: "Producción",
  room: "Sala",
  defect: "Defecto",
  defects: "Defectos",
  comment: "Comentario",
  comments: "Comentarios",
  reportingPeriod: "Período del informe",
  day: "Día",
  month: "Mes",
  year: "Año",
  dateRange: "Intervalo de fechas",
  from: "Desde",
  to: "Hasta",
  variables: "Variables",
  total: "Total",
  average: "Promedio",
  name: "Nombre",
  number: "Número",
  genetic: "Genética",
  genetics: "Genéticas",
  origin: "Origen",
  cancel: "Cancelar",
  submit: "Enviar",
  thisM: "Este",
  thisF: "Esta",
  deleteParentWarning: "¿Seguro que deseas eliminar esta planta? Se eliminará de la base de datos, incluidos los datos de sus hijos y estadísticas. Una vez confirmada la eliminación, esta acción no podrá deshacerse.",
  deleteChildWarning: "¿Seguro que deseas eliminar este hijo? Se eliminará de la base de datos, junto con sus estadísitcas. Una vez confirmada la eliminación, esta acción no podrá deshacerse.",
  confirmDelete: "Confirmar eliminación"
};

app.lang.strings.welcomeMsg = "Bienvenido/a a " + app.lang.strings.appName;
app.lang.strings.saveChanges = app.lang.strings.save + " " + app.lang.strings.changes.toLowerCase();
app.lang.strings.addParent = app.lang.strings.add + " " + app.lang.strings.parent.toLowerCase();
app.lang.strings.addNewParent = app.lang.strings.add + " " + app.lang.strings.newM.toLowerCase() + " " + app.lang.strings.parent.toLowerCase();
app.lang.strings.editParent = app.lang.strings.edit + " " + app.lang.strings.parent.toLowerCase();
app.lang.strings.deleteParent = app.lang.strings.del + " " + app.lang.strings.parent.toLowerCase();
app.lang.strings.addChild = app.lang.strings.add + " " + app.lang.strings.child.toLowerCase();
app.lang.strings.addNewChild = app.lang.strings.add + " " + app.lang.strings.newM.toLowerCase() + " " + app.lang.strings.child.toLowerCase();
app.lang.strings.editChild = app.lang.strings.edit + " " + app.lang.strings.child.toLowerCase();
app.lang.strings.deleteChild = app.lang.strings.del + " " + app.lang.strings.child.toLowerCase();
app.lang.strings.dateIn = app.lang.strings.date + " " + app.lang.strings.inW.toLowerCase();
app.lang.strings.dateOut = app.lang.strings.date + " " + app.lang.strings.outW.toLowerCase();
app.lang.strings.heightIn = app.lang.strings.height + " " + app.lang.strings.inW.toLowerCase();
app.lang.strings.heightOut = app.lang.strings.height + " " + app.lang.strings.outW.toLowerCase();
app.lang.strings.qualityIn = app.lang.strings.quality + " " + app.lang.strings.inW.toLowerCase();
app.lang.strings.qualityOut = app.lang.strings.quality + " " + app.lang.strings.outW.toLowerCase();
app.lang.strings.totalChildrenProduction = app.lang.strings.production + " " + app.lang.strings.total.toLowerCase() + " de " + app.lang.strings.children.toLowerCase();
app.lang.strings.averageChildrenProduction = app.lang.strings.production + " " + app.lang.strings.average.toLowerCase() + " de " + app.lang.strings.children.toLowerCase();
app.lang.strings.averageInQuality = app.lang.strings.quality + " de " + app.lang.strings.inW.toLowerCase() + " " + app.lang.strings.average.toLowerCase();
app.lang.strings.averageOutQuality = app.lang.strings.quality + " de " + app.lang.strings.outW.toLowerCase() + " " + app.lang.strings.average.toLowerCase();
app.lang.strings.averageInHeight = app.lang.strings.height + " de " + app.lang.strings.inW.toLowerCase() + " " + app.lang.strings.average.toLowerCase();
app.lang.strings.averageOutHeight = app.lang.strings.height + " de " + app.lang.strings.inW.toLowerCase() + " " + app.lang.strings.average.toLowerCase();
