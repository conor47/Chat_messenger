// file containing our graphql resolvers 

// we import the Users model

const {User} = require('../models')

module.exports = {

Query: {
        getUsers: async () => {
            try{
                const users = await User.findAll()
                return users
            } catch (err) {
                console.log(err);
            }
             
        },
      },
}