app.controllers.appController = new Ext.regController('appController',{
    //显示创建生活轨迹页面
    showNoteForm:function(){
        Ext.getCmp('viewport').setActiveItem('noteForm',{
            type:'slide',
            direction:'left'
        });
    },
    //显示列表页面
    showListPanel:function(){
        Ext.getCmp("viewport").setActiveItem('listPanel',{
            type:'slide',
            direction:'left'
        });
    },

    //显示浏览页面
    showViewNote:function(){
        Ext.getCmp("viewport").setActiveItem('viewNote',{
            type:'slide',
            direction:'left'
        });
    },

    //保存生活轨迹记录
    saveNote:function(){
        var form = Ext.getCmp("noteForm");
        var store = app.stores.noteStore;

        var last = store.last();
        var maxId = last==undefined?1:last.data.id+1;
        form.submit({
            waitMsg:'处理中...',
            success:function(){
                app.controllers.appController.showListPanel();
            }
        });
        var m = Ext.ModelMgr.create({id:maxId},'note');
        form.updateRecord(m,false);
        app.stores.noteStore.insert(maxId,m);
        app.stores.noteStore.sync();
        form.reset();
        app.controllers.appController.showListPanel();
    },

    showNote:function(record, btn, index){
        app.controllers.appController.showViewNote();
        var data = record.data;
        var viewNote = Ext.getCmp('viewNote');
        if(data.latitude == "" || data.longitude == ""){
            Ext.getCmp('viewNote').update(data);
            Ext.getCmp('map').hide();
        }else{
            app.controllers.appController.showNoteByMap(data);
        }
        Ext.getCmp('noteId').setValue(data.id);
    },

    showNoteByMap:function(data){
        var map = Ext.getCmp('map');
        map.show();
        var latlng = {latitude:data.latitude,longitude:data.longitude};
        map.update(latlng);

        var infowindow = new google.maps.InfoWindow({
            content: '<p>'+data.title+'</p><p>'+data.content+'</p>'
        });

        var center = new google.maps.LatLng(data.latitude, data.longitude);
        var marker = new google.maps.Marker({
	        position: center,
	        title : data.title,
	        map: map.map
	    });
        google.maps.event.addListener(marker,'mouseover',function() {
          infowindow.open(map,marker);
        });
        google.maps.event.addListener(marker, 'mouseout',function() {
          infowindow.close();
        });
    },

    showNoteActionSheet:function(){
        app.views.moreActionSheet.show();
    },

    removeAllNote:function(){
        Ext.Msg.confirm("确认", "你确认要清除本地所有数据?", function(){
            var count = app.stores.noteStore.getCount();
            for(var i=0;i<count;i++){
                app.stores.noteStore.removeAt(0);
            }
            app.stores.noteStore.sync();
            app.views.moreActionSheet.hide();
        });
    },

    getCurrentPosition:function(){
        var geo = new Ext.util.GeoLocation({
            autoUpdate: true,
            listeners: {
                locationupdate: function (geo) {
                    Ext.getCmp('latitude').setValue(geo.coords.latitude);
                    Ext.getCmp('longitude').setValue(geo.coords.longitude);
                },
                locationerror:function(geo,
                                       bTimeout,
                                       bPermissionDenied,
                                       bLocationUnavailable,
                                       message){
                }
            }
        });
        geo.updateLocation();
    },

    deleteNote:function(){
        var noteId = Ext.getCmp('noteId').getValue();
        var store = app.stores.noteStore;
        var record = store.findRecord('id',noteId);
        store.remove(record);
        store.sync();
        app.controllers.appController.showListPanel();
    },

    clearPosition:function(){
        Ext.getCmp('latitude').setValue('');
        Ext.getCmp('longitude').setValue('');
    }

});
