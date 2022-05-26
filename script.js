let allQuestions = [
    {
        "step" : '1',
        "question": "1. Who is President of the United States?",
        "choices": ["Donald Trump", "Hillary Clinton", "Barack Obama", "Joe Biden"],
        "correctAnswer": 0
    },
    {
        "step" : '2',
        "question": "2. Who is Prime Minister of the United Kingdom?",
        "choices": ["David Cameron", "Gordon Brown", "Theresa May", "Boris Johnson"],
        "correctAnswer": 3
    },
    {
        "step" : '3',
        "question": "3. Who is Prime Minister of the Netherlands?",
        "choices": ["Hugo de Jonge", "Marc Rutte", "Geert Wilders", "Kajsa Ollongren"],
        "correctAnswer": 1
    }
];

    

let leaderboardBtn = document.getElementById('leaderboard');
let loginBtn = document.getElementById('login');

async function quiz_proper() {
    let login = localStorage.getItem('login');
    let steps = [];
    let answers = [];
    let score = 0;

    allQuestions.forEach((question) => {
        steps.push(question['step']);
        answers.push(question['correctAnswer']);
    });

    const swalQueueStep = await Swal.mixin({
        confirmButtonText: 'Forward',
        cancelButtonText: 'Back',
        progressSteps: steps,
        customClass: 'swal-wide',
    });

    const values = [];
    let currentStep;

    for (currentStep = 0; currentStep < steps.length;) {
        var result = await swalQueueStep.fire({
            title: `Question for ${login}: `,
            text: allQuestions[currentStep]['question'],
            showCancelButton: currentStep > 0,
            currentProgressStep: currentStep,
            input: 'radio',
            inputOptions: {
                '0': allQuestions[currentStep]['choices'][0],
                '1': allQuestions[currentStep]['choices'][1],
                '2': allQuestions[currentStep]['choices'][2],
                '3': allQuestions[currentStep]['choices'][3],
            },
            inputAttributes: {
                required: true
            },
            reverseButtons: true,
            validationMessage: 'This field is required'

        })

        if (result.value) {
            //values[currentStep] = result.value;
            values[currentStep] = parseInt(result.value);
            currentStep++;
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            currentStep--;
        } else {
            break;
        }
    }
        
    if (currentStep === steps.length) {
        for(let i = 0; i < answers.length; i++)
        {
            if(answers[i] === values[i])
            {
                score++;
            }
        }
        
    }

    Swal.fire(
        {    
            title: `Quiz taking success!`,
            text: `Hi ${login}! Your score is ${score}/${answers.length}.`
        }
    )

    let board = JSON.parse(localStorage.getItem('leader'));
    const record = {
        name: login,
        score: score,
        total: answers.length,
    }
    board.push(record);

    board.sort(function (a, b) {
        return b.score - a.score;
    })
    localStorage.setItem('leader', JSON.stringify(board));



}

loginBtn.onclick = function () {
    Swal.fire(
        {
            icon: 'info',
            title: `Let's Start!`,
            html: '<input type="text" id="login" style="margin : 0 auto;" class="swal2-input" placeholder="Username">',
            confirmButtonText: 'Start the quiz!',
            focusConfirm: false,
            preConfirm: () => {
                const login = Swal.getPopup().querySelector('#login').value;
                if (!login) {
                    Swal.showValidationMessage(`Please enter username`)
                }
                localStorage.setItem('login', login);
                return { login: login }
            }

        }
    ).then((result) => {
        quiz_proper();
    })


}

leaderboardBtn.onclick = function () {
    let leader = JSON.parse(localStorage.getItem('leader'));
    let content = ''

    if (leader.length !== 0) {
        content += '<table class="hover">'
        content += '<thead> <tr> <th> Name </th> <th> Score </th> </tr></thead>'
        leader.forEach(element => {
            content += '<tr>';
            content += '<td>';
            content += element.name;
            content += '</td>';
            content += '<td>';
            content += element.score;
            content += '</td>';
            content += '</tr>';
        });
    }

    content += '</table>'
    if (leader.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No one has tried the quiz yet...',
            
        })
    }
    else {
        Swal.fire(
            {
                title: 'Leaderboard',
                html: content
            }
        );
    }
}

document.querySelector('body').onload = function () {
    /** once the page has finished loading */

    if (localStorage.getItem('leader') === null) {
        //set the empty leaderboard
        // dummy records
        /*
        const record1 = {
            name: "Person 1",
            score: 5
        }
        const record2 = {
            name: "Person 2",
            score: 3
        }
        const record3 = {
            name: "Person 3",
            score: 4
        }

        let board = [record1, record2, record3];
        */
        let board = [];
        //sort the board by score

        localStorage.setItem('leader', JSON.stringify(board));

    }

}