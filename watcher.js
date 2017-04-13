  function Watcher()
  {
        this.checkRem=function(list){

            var timelist=[],datelist=[];
            var d=new Date();
            var dd=(d.getDate()<10)?'0'+d.getDate():d.getDate(), 
            mm=((d.getMonth()+1)<10)?'0'+(d.getMonth()+1):(d.getMonth()+1) ,
            yyyy=d.getFullYear();
            var date=yyyy+'-'+mm+'-'+dd;
            var hours=(d.getHours()<10)? ('0'+d.getHours()):d.getHours(),
             min=(d.getMinutes()<10)? ('0'+d.getMinutes()):d.getMinutes();
            var time=hours+':'+min;    

            

            for(i in list)
            {
                timelist[i]=list[i].Rem_time;
            }

                for(i in list)
            {
                datelist[i]=list[i].Rem_date;
            }

           

            for(i in list)
            {

                
                    if( list[i].Rem_time==time &&  list[i].Rem_date==date)
                    {   

                        return i;
                    }

            }
            
            


        };




  }