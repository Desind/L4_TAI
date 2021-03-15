let preQuestions;

let next = document.querySelector('.next');
let previous = document.querySelector('.previous');
let question = document.querySelector('.question');
let answers = document.querySelectorAll('.list-group-item');
let qnumber = document.querySelector('.qnumber');
let results = document.querySelector('.results');
let quiz = document.querySelector('.list');

let userScoreCount = document.querySelector('.userScorePoint');
let userAverage = document.querySelector('.average');
let pointsElem = document.querySelector('.score');
let restart = document.querySelector('.restart');
let index = 0;
let points = 0;
let currentQuestion = 0;
let lastUnanswered = 0;
let disabledQuestion = false;

fetch('https://quiztai.herokuapp.com/api/quiz')
    .then(resp => resp.json())
    .then(resp => {
        preQuestions = resp;
        // kod wykorzystujący preQuestions  <-
        initianteQuestion(0);
        function doAction(event) {
            //event.target - Zwraca referencję do elementu, do którego zdarzenie zostało pierwotnie wysłane.
            if(!disabledQuestion || index===lastUnanswered){
                if (event.target.innerHTML === preQuestions[index].correct_answer) {
                    points++;
                    pointsElem.innerText = points;
                    markCorrect(event.target);
                }
                else {
                    markInCorrect(event.target);
                }
                lastUnanswered++;
            }
            disabledQuestion = true;
        }

        for (let i = 0; i < answers.length; i++) {
            answers[i].addEventListener('click', doAction);
        }


        next.addEventListener('click',function () {
            if(currentQuestion>=preQuestions.length-1) {
                console.log("finito");
                results.style.display = 'block';
                quiz.style.display = 'none';
                userScoreCount.innerText = points;

                let timesSolved = localStorage.getItem('timesSolved');
                if(timesSolved == null){
                    timesSolved = 1;
                    localStorage.setItem('timesSolved','1');
                }else{
                    timesSolved++;
                    localStorage.setItem('timesSolved',timesSolved);
                }

                let average = localStorage.getItem('average');
                if(average == null){
                    localStorage.setItem('average',points);
                    userAverage.innerText = points;
                }else{
                    let av = ((timesSolved-1)*average + points)/timesSolved;
                    localStorage.setItem('average',av.toString());
                    userAverage.innerText = av;
                }
            }else{
                currentQuestion++;
                initianteQuestion(currentQuestion);
                if(currentQuestion>index){
                    index++;
                    disabledQuestion = false;
                }
            }
        });

        previous.addEventListener('click',function () {
            if(currentQuestion>0){
                currentQuestion--;
                initianteQuestion(currentQuestion);
            }
            disabledQuestion = true;
        });

        function initianteQuestion(number){
            qnumber.innerText = number+1;
            let qu = preQuestions[number];
            answers[0].style.backgroundColor = "#FFF";
            answers[1].style.backgroundColor = "#FFF";
            answers[2].style.backgroundColor = "#FFF";
            answers[3].style.backgroundColor = "#FFF";
            answers[0].innerText = qu.answers[0];
            answers[1].innerText = qu.answers[1];
            if(qu.type==="boolean"){
                answers[2].style.display = "none";
                answers[3].style.display = "none";
            }else{
                answers[2].style.display = "block";
                answers[3].style.display = "block";
                answers[2].innerText = qu.answers[2];
                answers[3].innerText = qu.answers[3];
            }
            question.innerHTML = qu.question;
        }


        function markCorrect(target) {
            target.style.backgroundColor = "#77BB77";
        }
        function markInCorrect(target) {
            target.style.backgroundColor = "#F99";
        }





        restart.addEventListener('click', function (event) {
            event.preventDefault();
            index = 0;
            points = 0;
            currentQuestion = 0;
            lastUnanswered = 0;
            let userScorePoint = document.querySelector('.score');
            userScorePoint.innerHTML = points.toString();
            initianteQuestion(index);
            disabledQuestion = false;
            quiz.style.display = 'block';
            results.style.display = 'none';
        });

    });
