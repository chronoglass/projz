var userListData = [];

$(document).ready(function() {
  populateTable();
  $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
  $('#btnAddUser').on('click', addUser);
  $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
});

function populateTable(){
  var tableContent = '';
  $.getJSON( '/api/u/all', function( data ){
    userListData = data;
    $.each(data, function() {
      tableContent += '<tr>';
      tableContent += '<td><a href="#" class="linkshowuser" rel="'+this.nickname+'">' + this.nickname + '</a></td>';
      tableContent += '<td>' + this.email + '</td>';
      tableContent += '<td>' + this.userlevel + '</td>';
      tableContent += '<td><a href="#" class="linkdeleteuser" rel="'+this._id+'">delete</a></td>';
      tableContent += '</tr>';
    }); 
    $('#userList table tbody').html(tableContent);
  });
};

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
      'nickname': $('#addUser fieldset input#inputUserName').val(),
      'email': $('#addUser fieldset input#inputUserEmail').val(),
      'userlevel': '5',
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
        populateTable();
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
      populateTable();
    });
  } else {
    return false;
  }
};
