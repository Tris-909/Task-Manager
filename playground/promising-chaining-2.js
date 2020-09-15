require('../src/db/mongoose');
const Task = require('../src/models/task');

Task.findByIdAndDelete({
    _id: '5f5df609d7130420bc596cba'
}).then((data) => {
    console.log(data);

    return Task.find({
        completed: false
    });
}).then((result) => {
    console.log('Total amount of incompleted tasks : ', result.length);
}).catch((error) => {
    console.log(error);
});