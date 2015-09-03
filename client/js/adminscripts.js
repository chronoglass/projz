var userListData = [];
var thingListData = [];

$(document).ready(function() {
  populateTables();
  $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
  $('#btnAddUser').on('click', addUser);
  $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
  $('#btnUserPanel').on('click',  flip);
  $('#btnThingPanel').on('click', flip);
});

function populateTables(){
  var utableContent = '';
  $.getJSON( '/api/u/all', function( data ){
    userListData = data;
    $.each(data, function() {
      utableContent += '<tr>';
      utableContent += '<td>' + this.name.first + '</td>';
      utableContent += '<td>' + this.name.last + '</td>';
      utableContent += '<td><a href="#" class="linkshowuser" rel="'+this.nickname+'">' + this.nickname + '</a></td>';
      utableContent += '<td>' + this.email + '</td>';
      if(!this.location){
        utableContent += '<td>Not available</td>';
      }else{
        utableContent += '<td>' + this.location + '</td>';
      }
      utableContent += '<td>' + this.ulevel + '</td>';
      utableContent += '<td><a href="#" class="linkdeleteuser" rel="'+this._id+'">delete</a></td>';
      utableContent += '</tr>';
    }); 
    $('#userList table tbody').html(utableContent);
  });
  var ttableContent = '';
  $.getJSON( '/api/thing/all', function( tdata ){
    thingListData = tdata;
    $.each(tdata, function() {
      var that = this;
      $.getJSON( '/api/u/byid/' + that.ownerid, function( tudata ){
        $.each(tudata, function(){
          ttableContent += '<tr>';
          ttableContent += '<td><a href="#" class="linkshowthing" rel="'+that.title+'">' + that.title + '</a></td>';
          ttableContent += '<td><a href="#" class="linkshowuser" rel="'+this.nickname+'">' + this.nickname + '</a></td>';
          ttableContent += '<td><a href="#" class="linkdeletething" rel="'+that._id+'">delete</a></td>';
          ttableContent += '</tr>';
        });
        $('#adminThingList table tbody').html(ttableContent);
      });
    }); 
  });
};

/* future functionality to replace populate table with refreshing only the visible table */
//function updateDisplay();

function showUserInfo(event){
  event.preventDefault();
  var thisUserName = $(this).attr('rel');
  var arrayPosition = userListData.map(function(arrayItem){return arrayItem.name}).indexOf(thisUserName);
  var thisUserObject = userListData[arrayPosition];

  $('#userInfoName').text(thisUserObject.name);
}

function addUser(event){
  event.preventDefault();
  
  //TODO: proper data validation
  var errorNum = 0;
  $('#addUser input').each(function(index, val){
    if($(this).val() === ''){errorNum++; }
  });

  if(errorNum === 0){
    var newUser = {
      'nickname': $('#addUser fieldset input#inputUserNick').val(),
      'nameFirst': $('#addUser fieldset input#inputUserNameFirst').val(),
      'nameLast': $('#addUser fieldset input#inputUserNameLast').val(),
      'email': $('#addUser fieldset input#inputUserEmail').val(),
      'location': $('#addUser fieldset input#inputUserLoc').val(),
      'userlevel': '5',
      'pwd': $('#addUser fieldset input#inputUserPwd').val(),
    }
    
    $.ajax({
      type: 'POST',
      data: newUser,
      url: '/api/u/adduser',
      dataType: 'JSON'
    }).done(function(response){
      if(response.msg === ''){
        // blank response = no problem so clear input fields
        $('#addUser fieldset input').val('');
        populateTables();
      } else {
        //if something went wrong sent error as alert
        alert('Error: ' + response.msg);
      }
    });
  } else {
    //if errornum is higher than 0, return error
    alert('Please fill out all fields');
    return false;
  }
}

//delete user
function deleteUser(event){
  event.preventDefault();

  var confirmation = confirm('Are you sure you want to delete this user?');
  if(confirmation === true){
    $.ajax({
      type: 'DELETE',
      url: '/api/u/deleteuser/' + $(this).attr('rel')
    }).done(function(response){
      if(response.msg === ''){
        console.log('no err');
      }else{
        alert('Error: ' + response.msg);
      }
      populateTables();
    });
  } else {
    return false;
  }
};

//flip between admin panels
function flip(event){
    event.preventDefault();
    console.log(this.value);
	switch (this.value){
	  case "0":
	    console.log("Flip to user");
	    $('#thingwrapper').hide();
	    $('#tagwrapper').hide();
	    $('#userwrapper').show();
	    break;
	  case "1":
	    console.log("Flip to thing");
	    $('#userwrapper').hide();
	    $('#tagwrapper').hide();
	    $('#thingwrapper').show();
	    break;
	  case "2":
	  	$('#userwrapper').hide();
	    $('#thingwrapper').hide();
	    $('#tagwrapper').show();
	    break;
	}
}