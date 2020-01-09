exports.index = (req, res) => {
    res.render('index.html', {
        title: 'Hello Title'
    });
};