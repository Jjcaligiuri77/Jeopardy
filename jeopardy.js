let categories = [];

async function getCategoryIds() {
  let results = await axios.get('https://jservice.io/api/categories', {params: { count: 100, offset: Math.floor(Math.random() * 18000)}});
  let categoryOfIds = results.data.map(category => category.id);
  return categoryOfIds;
}

async function getCategory(catId) {
  let results = await axios.get('https://jservice.io/api/category', {params: { id: catId }});
  let validClues = results.data.clues.filter(clue => clue.question);
  const cluesArray = [];
  for (let clue of validClues) {
    cluesArray.push({question: clue.question, answer: clue.answer, showing: null});
  }
  return {title: results.data.title, clues: cluesArray};
}

function fillTable() {
  $('#top-row').empty();
  $('tbody').empty();
  $('tbody').on('click', 'td', handleClick);

  for (let cat of categories) {
    $('#top-row').append(`<th>${cat.title}</th>`);
  }

  for (let y = 0; y < 5; y++) {
    let $row = $('<tr>');
    for (let x = 0; x < 6; x++) {
      $row.append(`<td id="${x}-${y}">&#10067;</td>`);
    }
    $('tbody').append($row);
  }
}

function handleClick(event) {
  event.stopImmediatePropagation();
  const first = event.target.id[0];
  const second = event.target.id[2];
  const cluesObj = categories[first].clues[second];
  if (!cluesObj.showing) {
    event.target.innerHTML = cluesObj.question;
    cluesObj.showing = 'question';
  } else if (cluesObj.showing == 'question') {
    event.target.innerHTML = cluesObj.answer;
    cluesObj.showing = 'answer';
  } else if (cluesObj.showing == 'answer') {
    return;
  }
}

function shuffleAndReduceIds(idArr) {
  let identity = idArr.length - 1;
  if (identity === 0) {
    return;
  }
  while (identity >= 0) {
    let x = Math.floor(Math.random() * identity);
    let tempid = idArr[identity];
    let tempX = idArr[x];
    idArr[identity] = tempX;
    idArr[x] = tempid;
    identity--;
  }
  return idArr.slice(0, 6);
}

async function setupAndStart() {
  categories = [];
  let categoryOfIds = await getCategoryIds();
  let packagedArray = shuffleAndReduceIds(categoryOfIds);
  for (let id of packagedArray) {
    categories.push(await getCategory(id));
  }
  fillTable();
}

$('#new-game').on('click', setupAndStart);
setupAndStart();