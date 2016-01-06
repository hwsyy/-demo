
/****** 视图组件 *****/
/* 主视图 */
app.views.viewport = Ext.extend(Ext.Panel,{
    id:'viewport',
    fullscreen:true,
    layout:'card',
    activeItem:0,
    items:[
        {
            xtype:'listPanel'
        },{
            xtype:'noteForm'
        },{
            xtype:'viewNote'
        }
    ],
    initComponent : function(){
		app.views.viewport.superclass.initComponent.apply(this,arguments);
	}
});

/* 显示列表容器 */
app.views.listPanel = Ext.extend(Ext.Panel,{
    id:'listPanel',
    layout:'card',
    dockedItems:[{
        xtype:'toolbar',
        dock:'top',
        title:'生活轨迹',
        items:[{
            xtype:'button',
            text:'添加',
            handler:function(){
                app.controllers.appController.showNoteForm();
            }
        },{
            xtype:'spacer'
        },{
            xtype:'button',
            text:'更多功能',
            handler:function(){
                app.controllers.appController.showNoteActionSheet();
            }
        }]
    }],
    items:[{
        xtype:'noteList'
    }],
    initComponent : function(){
		app.views.listPanel.superclass.initComponent.apply(this,arguments);
	}
});
Ext.reg('listPanel',app.views.listPanel);

/* 创建表单容器 */
app.views.noteForm = Ext.extend(Ext.form.FormPanel,{
    id:'noteForm',
    scroll:'vertical',
    dockedItems:[{
        xtype:'toolbar',
        dock:'top',
        title:'创建',
        items:[{
            xtype:'button',
            text:'提交',
            handler:function(){
                app.controllers.appController.saveNote();
            }
        },{
            xtype:'spacer'
        },{
            xtype:'button',
            text:'返回',
            handler:function(){
                app.controllers.appController.showListPanel();
            }
        }]
    }],
    items:[
        {
            xtype:'textfield',
            name:'title',
            labelWidth:'0%',
            maxLength:20,
            placeHolder:'请输入标题'
        },{
            xtype:'textareafield',
            name:'content',
            labelWidth:'0%',
            maxLength : 1024,
            maxRows : 10,
            placeHolder:'请输入生活轨迹内容'
        },{
            xtype:'togglefield',
            name:'isPosition',
            label:'是否获取你的当前位置',
            labelWidth:'65%',
            listeners:{
                change:function(slider,thumb,newValue,oldValue){
                    if(newValue==1 && oldValue==0){
                        app.controllers.appController.getCurrentPosition();
                    }
                    if(newValue == 0){
                        app.controllers.appController.clearPosition();
                    }
                }
            }
        },{
            xtype:'hiddenfield',
            id:'latitude',
            name:'latitude'
        },{
            xtype:'hiddenfield',
            id:'longitude',
            name:'longitude'
        }
    ],
    initComponent : function(){
		app.views.listPanel.superclass.initComponent.apply(this,arguments);
	}
});
Ext.reg('noteForm',app.views.noteForm);

/* 浏览视图 */
app.views.viewNote = Ext.extend(Ext.Panel,{
    id:'viewNote',
    tpl : new Ext.XTemplate(
	    '<header><h1><em>标题：</em>{title}</h1></header>',
		'<p><em>内容：</em>{content}</p>'
	),
    dockedItems:[{
        xtype:'toolbar',
        dock:'top',
        title:'生活轨迹',
        items:[{
            xtype:'button',
            text:'返回',
            handler:function(){
                app.controllers.appController.showListPanel();
            }
        },{
            xtype:'spacer'
        },{
            xtype:'button',
            text:'删除',
            handler:function(){
                app.controllers.appController.deleteNote();
            }
        }]
    }],
    items:[{
        xtype:'map',
        id:'map',
        mapOptions:{
            zoom : 14
        }
    },{
        xtype:'hiddenfield',
        id:'noteId'
    }],
    initComponent : function(){
		app.views.viewNote.superclass.initComponent.apply(this,arguments);
	}
});
Ext.reg('viewNote',app.views.viewNote);

/****** 列表组件 *****/
/* 列表对象 */
app.views.noteList = Ext.extend(Ext.List,{
	store : app.stores.noteStore,
    cls:'noteList',
	itemTpl : '<p class="title">{title}</p><p>{content}</p>',
    onItemDisclosure:{
        scope:this,
        handler:function(record, btn, index){
            app.controllers.appController.showNote(record, btn, index);
        }
    },
	initComponent : function(){
		app.stores.noteStore.load();
		app.views.noteList.superclass.initComponent.apply(this,arguments);
		this.enableBubble('selectionchange');
	}

});
Ext.reg('noteList',app.views.noteList);

app.views.moreActionSheet = new Ext.ActionSheet({
    items : [
        {
            text:'清除所有数据',
            scope:this,
            handler:function(){
                app.controllers.appController.removeAllNote();
            }
        },{
            text:'返回',
            scope:this,
            handler:function(){
                app.views.moreActionSheet.hide();
            }
        }
    ]
});