var result;
var fId = 0;

function search(event) {
    event.preventDefault();
    let word = document.getElementById("searchWord").value;
    let sWord = word.toLowerCase().trim();
    let url = "https://api.dictionaryapi.dev/api/v2/entries/en/" + sWord;
    let response = fetch(url);
    response.then((res) => res.json()).then((data) => getWord(data));
}

function getWord(data) {
    var mainel = document.getElementById("results");
    mainel.innerHTML = "";
    if (data.length > 0) {
        //local storage adding
        if (localStorage.getItem("history")) {
            var history = localStorage.getItem("history");
            var array = JSON.parse(history);
            var sWord = data[0].word;
            var isThere = array.filter((value, index, array) => {
                return array[index].word === sWord;
            });
            if (array.includes(isThere[0])) {
                var idx = array.indexOf(isThere[0]);
                array.splice(idx, 1);

                var obj = {};
                obj.word = sWord;
                obj.meaning = data[0].meanings[0].definitions[0].definition;

                array.unshift(obj);
                localStorage.setItem("history", JSON.stringify(array));
            } else {
                var obj = {};
                obj.word = sWord;
                obj.meaning = data[0].meanings[0].definitions[0].definition;

                array.unshift(obj);
                localStorage.setItem("history", JSON.stringify(array));
            }
        } else {
            var array = [];

            var obj = {};
            obj.word = sWord;
            obj.meaning = data[0].meanings[0].definitions[0].definition;

            array.unshift(obj);
            localStorage.setItem("history", JSON.stringify(array));
        }

        var div = document.createElement("div");
        div.innerHTML = `<span class="wordName">Word: <b><span class="nameOfWord">"` + data[0].word + `"</span></b></span>`;
        mainel.appendChild(div);

        for (let i = 0; i < data[0].meanings.length; i++) {
            var el = data[0].meanings[i];
            var partOfSpeech = el.partOfSpeech;
            var el1 = document.createElement("ol");
            var span01 = document.createElement("div");
            span01.className = "span-title"
            span01.innerHTML = `Part of Speech : <b>` + partOfSpeech + `</b>`;
            el1.appendChild(span01);

            for (let j = 0; j < el.definitions.length; j++) {
                const definition = el.definitions[j];
                var el2 = document.createElement("li");
                var ul1 = document.createElement("ul");
                var li2 = document.createElement("li");
                li2.innerHTML = `Definitions : <b>` + definition.definition + `</b>`;
                ul1.appendChild(li2);
                if(definition.example){
                    var li3 = document.createElement("li");
                    li3.innerHTML = `Examples : <b>` + definition.example + `</b>`;
                    ul1.appendChild(li3);
                }

                el2.appendChild(ul1);
                el1.appendChild(el2);
            }

            mainel.appendChild(el1);
        }

        mainel.setAttribute("class", "bg-res");
    } else {
        var errDiv1 = document.createElement("div");
        errDiv1.setAttribute("class", "error");
        errDiv1.innerHTML = "Error:- " + data.title;
        mainel.appendChild(errDiv1);

        var errDiv2 = document.createElement("div");
        errDiv2.setAttribute("class", "error");
        errDiv2.innerHTML = "Message:- " + data.message;
        mainel.appendChild(errDiv2);

        var errDiv3 = document.createElement("div");
        errDiv3.innerHTML = "Resolution: -";

        var resolutionDiv = document.createElement("div");
        resolutionDiv.innerHTML = data.resolution;
        errDiv3.appendChild(resolutionDiv);
        mainel.appendChild(errDiv3);

        mainel.setAttribute("class", "bg-res");
    }
}

function historyBtn() {
    var id1 = document.getElementById("id1").classList;
    var id2 = document.getElementById("id2").classList;
    var id3 = document.getElementById("id3").classList;
    var res = document.getElementById("results").classList;
    var his = document.getElementById("historyPage");
    var BtnHis = document.getElementById("hisBtn");
    var BtnBack = document.getElementById("serBtn");

    id1.toggle("hide1");
    id2.toggle("hide1");
    id3.toggle("hide1");
    res.toggle("hide1");
    his.classList.toggle("hide1");
    BtnHis.classList.toggle("hide1");
    BtnBack.classList.toggle("hide1");

    var historyArr = JSON.parse(localStorage.getItem("history"));
    his.innerHTML = "";

    for (let i = 0; i < historyArr.length; i++) {
        var mainDiv = document.createElement("div");
        mainDiv.classList.add("hisItem");
        mainDiv.setAttribute("id", `d${fId}`);
        mainDiv.innerHTML = "Word: " + historyArr[i].word;

        var div = document.createElement("div");
        div.classList.add("hisInnerItem");
        div.innerHTML = historyArr[i].meaning;

        var div1 = document.createElement("div");
        div1.classList.add("flex2");

        var btn = document.createElement("button");
        btn.setAttribute("class", "material-icons deleteBtn");
        btn.setAttribute("onclick", `deleteItem('${fId}')`);
        btn.innerHTML = "delete";

        div1.appendChild(btn);
        mainDiv.appendChild(div);
        mainDiv.appendChild(div1);
        his.appendChild(mainDiv);
        fId++;
    }
}

function searchPage() {
    var id1 = document.getElementById("id1").classList;
    var id2 = document.getElementById("id2").classList;
    var id3 = document.getElementById("id3").classList;
    var res = document.getElementById("results");
    var his = document.getElementById("historyPage");
    var BtnHis = document.getElementById("hisBtn");
    var BtnBack = document.getElementById("serBtn");

    res.innerHTML = "";
    his.innerHTML = "";

    id1.toggle("hide1");
    id2.toggle("hide1");
    id3.toggle("hide1");
    res.classList.toggle("hide1");
    res.classList.remove("bg-res");
    his.classList.toggle("hide1");
    BtnHis.classList.toggle("hide1");
    BtnBack.classList.toggle("hide1");

    document.getElementById("searchWord").value = "";
}

function deleteItem(id) {
    var flexId = "d" + id;

    var array = JSON.parse(localStorage.getItem("history"));

    const element = document.getElementById(flexId);
    var word1 = element.innerHTML;
    var word = word1.replace("Word: ", "");
    var value1 = array.filter((value, index, arr) => {
        return arr[index].word === word;
    });
    var idx = array.indexOf(value1[0]);
    array.splice(idx, 1);
    localStorage.setItem("history", JSON.stringify(array));
    element.remove();
}
