require('../src/db/mongoose');
const User = require('../src/models/user');
const Task = require('../src/models/task');

// 5f5eb5bf5ab292384c1cd1ff

// User.findByIdAndUpdate('5f5eb5bf5ab292384c1cd1ff', { password: 'Minhtri1' }).then((result) => {
//     console.log(result);

//     return User.countDocuments({ password: 'Minhtri1' })
// }).then((data) => {
//     console.log(data);
// }).catch((error) => {
//     console.log(error);
// });

const changePassword = async (id, newPassword) => {
    const user = await User.findByIdAndUpdate(id, { password: newPassword });
    console.log(user);
    const count = await User.countDocuments({ password: newPassword });
    return count;
}

const deleteAndCountTaskById = async (id) => {
    const task = await Task.findOneAndDelete({
        _id: id
    });
    console.log(task);

    const count = Task.find({ completed: false });
    return count;
}

deleteAndCountTaskById('5f5f7978561c0a30d0bb63c8').then((result) => {
    console.log(result.length);
}).catch((error) => {
    console.log(error);
});

// changePassword('5f5eb5bf5ab292384c1cd1ff', 'Minhtri1').then((result) => {
//     console.log(result);
// }).catch((error) =>{ 
//     console.log(error);
// });