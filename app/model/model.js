app.models.note = Ext.regModel("note",{
	fields:[
		{name:'id',type:'int'},
		{name:'title',type:'string'},
        {name:'content',type:'string'},
        {name:'position',type:'string'},
        {name:'latitude',type:'string'},
        {name:'longitude',type:'string'}
	],
    /* 使用localStorage代理 */
	proxy : {
		type:'localstorage',
        id:'noteStorage'
	}
});