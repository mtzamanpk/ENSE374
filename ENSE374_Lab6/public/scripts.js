var listArray = [];
var listID = 0;

function createTask()
{
    $( "#lists" ).empty();
    listArray.forEach(function (list)
    {
      if (list[1] == 'unclaimed')
      {
      $( "#lists" ).append(
        `<div class="input-group mb-3">
            <input type="text" disabled class="form-control" placeholder="`+ list[2] + `" aria-label="Text input with checkbox">
            <button class="btn btn-outline-secondary" type="button" id="button-addon2" onclick="taskClaim('` + list[0] + `')">Claim</button>
        </div>` );
      }
      if (list[1] == 'claimed')
      {
      $( "#lists" ).append(
        `<div class="input-group mb-3">
            <div class="input-group-text">
            <input class="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input" onclick="taskFinish('` + list[0] + `')">
            </div>
            <input type="text" disabled class="form-control" placeholder="`+ list[2] + `" aria-label="Text input with checkbox">
            <button class="btn btn-outline-secondary" type="button" id="button-addon2" onclick="taskAbandon('` + list[0] + `')">Abandon</button>
        </div>` );
      }
      if (list[1] == 'finished')
      {
      $( "#lists" ).append(
        `<div class="input-group mb-3">
            <div class="input-group-text">
            <input class="form-check-input mt-0" checked checkbox type="checkbox" value="" aria-label="Checkbox for following text input" onclick="taskUnfinished('` + list[0] + `')">
            </div>
            <input type="text" disabled class="form-control underline" placeholder="`+ list[2] + `" aria-label="Text input with checkbox">
        </div>` );
      }
    })
}

function taskAdd()
{
  list = $( "#listText" ).val();
    if (list.length > 0)
      {
        listArray.push([listID, 'unclaimed', list]);
        listID = listID + 2;
        $( "#listText" ).val(null);
        createTask();
      }
}

function taskAbandon(ID)
{
  listArray.forEach(function (list)
  {
    if (list[0] == ID)
    {
      list[1] = 'unclaimed';
    }
  })
    createTask();
}

function taskClaim(ID)
{
  listArray.forEach(function (list)
  {
    if (list[0] == ID)
      {
        list[1] = 'claimed';
      }
  })
    createTask();
}

function taskUnfinished(ID)
{
  listArray.forEach(function (list)
  {
    if (list[0] == ID)
    {
      list[1] = 'claimed';
    }
  })
    createTask();
}

function taskFinish(ID)
{
  listArray.forEach(function (list)
  {
    if (list[0] == ID)
    {
      list[1] = 'finished';
    }
  })
    createTask();
}

function taskRemove()
{
  listArray.forEach(function (list)
  {
    if (list[1] == 'finished')
    {
      var temp = listArray.indexOf(list);
      if (temp !== -1)
      {
        listArray.splice(temp, 1);
      }
    }
  })
    createTask();
}