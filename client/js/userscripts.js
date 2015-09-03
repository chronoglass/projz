var thingListData = [];

$(document).ready(function() {
  populateThingTable();
  $('#activethings table tbody').on('click', 'td a.linkshowthing', showThingDetail);
  $('#btnNewThing').on('click', newThing);
  $('#thingList table tbody').on('click', 'td a.linkdeletething', deleteThing);
  $('#thingList table tbody').on('click', 'td a.linkshowthing', showThingDetail);
});

function populateThingTable(){
  var tableContent = '';
  $.getJSON( '/api/u/byname/testuser1', function( udata ){
  //console.log(udata[0]._id);
    $.getJSON( '/api/thing/u/' + udata[0]._id, function( data ){
      thingListData = data;
      $.each(data, function() {
        //console.log(this);
        if(this.status === "active" && this.treeParent === "root"){
          tableContent += '<tr>';
          tableContent += '<td><a href="#" class="linkshowthing" rel="' + this.title + '">' + this.title + '</a></td>'; 
          tableContent += '<td>' + (this.perNeed - 100) + '% </td>';
          tableContent += '<td>' + this.shared + '</td>';
          tableContent += '</tr>';
        }
      }); 
      $('#activethings table tbody').html(tableContent);
    });
  });
};

function showThingDetail(event){
  event.preventDefault();
  var thisThingTitle = $(this).attr('rel');
  var arrayPosition = thingListData.map(function(arrayItem){
    return arrayItem.title
  }).indexOf(thisThingTitle);
  var thisThingObject = thingListData[arrayPosition];
  console.log(thisThingObject);
  $('#editform').show();
  $('#thingInfoTitle').text(thisThingObject.title);
}

//current function adds user, not thing
function newThing(event){
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
function deleteThing(event){
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
