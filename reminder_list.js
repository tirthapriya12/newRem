function ReminderList() {
    var remArrList = [],
        db_manager = new DBManager();
    this.checkTotalIndex=function() {

        if (localStorage.length == 0) {
            localStorage.setItem('id', '0');

        }
        else {
            var id = localStorage.getItem('id');
            id = parseInt(id);
            return id;

        }

    };

    function updateId(i)
    {
        i++;
        localStorage.setItem('id',i);


    }

    this.addRem = function (obj) {


        var i = this.checkTotalIndex();
        remArrList[i] = obj;
        db_manager.insertData(remArrList[i], i);

        updateId(i);


        return i;


    };

    this.delRem = function (index) {

        db_manager.remData(index);


    };

    this.fetch = function () {

        var remArrListfetch = db_manager.fetchData();

       
        return remArrListfetch;


    };

    this.updateData=function(key)
    {
            db_manager.updateData(key);

    };


}