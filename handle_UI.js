window.addEventListener('load', function () {

    var UIObj = {
        lilist: document.getElementsByTagName("LI"),
        close: document.getElementsByClassName("close"),
        rem_text: document.getElementById('rem-text'),
        rem_date: document.getElementById('datepicker'),
        rem_time: document.getElementById('rem-time'),
        addBtn: document.getElementById('addBtn'),
        rem_list: new ReminderList(),
        list_index: 0,
        watcher: new Watcher(),
        timelist: []
    };


    UIObj.addBtn.addEventListener('click', inputData);


    updateUI();//updates UI on page load




    (function () {


        var date = new Date();

        if (date.getMinutes() < 10) {


            UIObj.rem_time.value = date.getHours() + ":0" + date.getMinutes();
        }
        else {
            UIObj.rem_time.value = date.getHours() + ":" + date.getMinutes();
        }



    })();

    reminderChecker();







    function inputData()// takes input on button click
    {


        if (UIObj.rem_text.value !== '' && UIObj.rem_text.value !== ' ' && UIObj.rem_date.value !== '' && UIObj.rem_time.value !== '') {
            //Setting the reminder Obj;

            if (!(checkDuplicateRem(UIObj.rem_date.value, UIObj.rem_time.value))) {

                var id = UIObj.rem_list.checkTotalIndex();
                var rem_obj = new Reminder(UIObj.rem_text.value, UIObj.rem_time.value, UIObj.rem_date.value, id, false);

                addToRemList(rem_obj);
                createListElm(UIObj.rem_text.value, UIObj.rem_time.value, UIObj.rem_date.value, id, UIObj.list_index, false);






                fillTimeList();
                UIObj.list_index++;
                strikeThroughElapsed();
            }
            else {
                alert('duplicate Reminder exists already');
            }
        }

        else {
            alert('please enter all the required fields ');
        }


    }




    function addCloseBtn(x) {


        var span = document.createElement("SPAN");
        var txt = document.createTextNode("\u00D7");
        span.className = "close";
        span.appendChild(txt);

        UIObj.lilist[x].appendChild(span);

        attachCloseBtnIconEvent(x);
    }




    function attachCloseBtnIconEvent(i) {
        UIObj.close[i].onclick = function () {

            var bool = confirm('Are You sure you want to delete this Reminder ?');
            if (bool) {
                var li = this.parentElement;  //UIObj.close[i].parentElement UIObj.lilist[i]
                li.style.display = "none";
                UIObj.rem_list.delRem(li.getAttribute('data-id'));
                //close.splice(i,1);

            }

        }

    }


    function createListElm(rem_text1, rem_time1, rem_date1, id, index, elapsed1) {






        var ul = document.getElementById("myUL");
        var li = document.createElement('li');
        li.innerHTML = '<span style="font-size:10px;">' + rem_time1 + ' - ' + rem_date1 + '   </span><br/>';
        li.innerHTML += '<p>' + rem_text1 + '</p>';
        li.setAttribute('data-id', index);



        ul.appendChild(li);
        UIObj.lilist[index] = li;

        addCloseBtn(index); //Add close Button to this rem.











    }





    function addToRemList(rem_obj, i) {



        UIObj.rem_list.addRem(rem_obj, i);  //add reminder to reminderlist array
    }




    function updateUI()//updates UI on relaoad . fetches from DataBase(localstorage)
    {

        var fetchedList = UIObj.rem_list.fetch();


        for (i in fetchedList) {
            updateUiList(fetchedList[i].Rem_title, fetchedList[i].Rem_time, fetchedList[i].Rem_date, i, fetchedList[i].id, fetchedList[i].elapsed);

        }
        if (fetchedList) {
            UIObj.list_index = fetchedList.length;
        }

        fillTimeList();
        strikeThroughElapsed();
    }


    function updateUiList(rem_text1, rem_time1, rem_date1, i, index, elapsed1) {

        var ul = document.getElementById("myUL");
        var li = document.createElement('li');
        li.innerHTML = '<span style="font-size:10px;">' + rem_time1 + ' - ' + rem_date1 + '   </span><br/>';
        li.innerHTML += '<p>' + rem_text1 + '</p>';
        li.setAttribute('data-id', index);
        //var li_text=document.createTextNode();

        //li.appendChild(li_text);


        ul.appendChild(li);
        UIObj.lilist[i] = li;

        addCloseBtn(i); //Add close Button to this rem.


    }

    function checkDuplicateRem(date, time) {
        var flag = false;

        for (i in UIObj.timelist) {
            if (UIObj.timelist[i].Rem_time == time && UIObj.timelist[i].Rem_date == date) {
                flag = true;
            }
        }

        return flag;
    }

    function fillTimeList() // fills timelist array on load which will be used to check duplcate reminder
    {
        var fetchedList = UIObj.rem_list.fetch();
        for (i in fetchedList) {
            UIObj.timelist[i] = { 'Rem_time': fetchedList[i].Rem_time, 'Rem_date': fetchedList[i].Rem_date };
        }

    }

    function reminderChecker() {

        setInterval(function () {
            var fetchedList = UIObj.rem_list.fetch();

            var index = UIObj.watcher.checkRem(UIObj.timelist);

            if (index >= 0) {

                if (!fetchedList[index].elapsed) {

                    var text = document.querySelectorAll('.w3-container p');

                    document.getElementById('rem-modal').style.display = 'block';
                    document.querySelector('.w3-display-topright').onclick = modalHandle;
                    document.getElementsByTagName('audio')[0].play();

                    text[0].innerHTML = fetchedList[index].Rem_title;
                    text[1].innerHTML = fetchedList[index].Rem_time;
                    text[2].innerHTML = fetchedList[index].Rem_date;
                    UIObj.rem_list.updateData(index);
                    notifyMe(text[0].innerText, text[1].innerText, text[2].innerText);

                }


            }



        }, 1000);


    }


    function modalHandle() {

        document.getElementById('rem-modal').style.display = 'none';
        document.getElementsByTagName('audio')[0].pause();
        strikeThroughElapsed();


    }



    function notifyMe(text, time, date) {


        var options = {
            body: text + '\n\n Time: ' + time + '\n Date:' + date,
            icon: 'images/chicken.png'
        };

        if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
        }


        else if (Notification.permission === "granted") {

            var notification = new Notification("Reminder!", options);

        }


        else if (Notification.permission !== "denied") {
            Notification.requestPermission(function (permission) {

                if (permission === "granted") {
                    var notification = new Notification("Reminder! ", options);

                }
            });
        }


    }


    function strikeThroughElapsed() {
        var d = new Date();
        var dd = (d.getDate() < 10) ? '0' + d.getDate() : d.getDate(),
            mm = ((d.getMonth() + 1) < 10) ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1),
            yyyy = d.getFullYear();
        var date = yyyy + '-' + mm + '-' + dd;
        var hours = (d.getHours()%12 < 10) ? ('0' + d.getHours() % 12) : d.getHours() % 12,
            min = (d.getMinutes()%12 < 10) ? ('0' + d.getMinutes() % 12) : d.getMinutes() % 12;
        var time = hours + ':' + min;

        var arr = UIObj.timelist[i].Rem_time;
        arr = arr.split(':');
        var UITimehrs=(arr[0]%12 <10)? '0'+arr[0]%12 : arr[0]%12 ,
        UITimemin=(arr[1]%12 <10)? '0'+arr[1]%12 : arr[0]%12;
        var UITime=UITimehrs+':'+UITimemin;






        for (i in UIObj.timelist) {

            console.log(UIObj.timelist[i].Rem_time + "  " + UIObj.timelist[i].Rem_date);
            if (UIObj.timelist[i].Rem_date <= date) {

                if (UITime <= time) {
                    UIObj.lilist[i].style['text-decoration'] = 'line-through';
                }

            }



        }






    }


});

