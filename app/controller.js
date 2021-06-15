const PollUser = require('./PollModel')

exports.signup = (req,res)=>{
    let newUser = new PollUser({
        username:req.body.username,
        password:req.body.password,
        polls:[],
    })

    newUser.save()
    .then(doc=>{
        res.status(200).json({
            message:"user saved successfully",
            user: {
                userid: doc._id,
                username: doc.username
            }
        })
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({
            error:err
        })
    })
}

exports.login = (req,res)=>{
    PollUser.findOne({username:req.body.username})
    .then(doc=>{
        if(doc.password===req.body.password){
            res.status(200).json({
                message:"successfully logged in",
                user:{
                    userid: doc._id,
                    username: doc.username
                }
            })
        }else{
            res.status(200).json({
                message:"username and password doesnt match",
            })
        }
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({
            error:err
        })
    })
}

exports.createPoll = async(req,res)=>{
    const newPoll = req.body.poll
    let oldPolls
    let userPolls
    await PollUser.findOne({_id:req.body.id})
    .then((doc)=>{
        oldPolls=doc.polls
        userPolls = doc.polls
        userPolls.push(newPoll)
    }).catch(err=>{
        console.log(err)
        res.status(500).json({
            error:err
        })
    })
    await PollUser.findByIdAndUpdate({_id:req.body.id},{$set:{polls:userPolls}},{new:true})
    .then(doc=>{
        let length = doc.polls.length
        let newPoll = doc.polls[length-1]

        res.status(200).json({
            message:"new poll created",
            poll:newPoll
        })
    }).catch(err=>{
        console.log(err)
        res.status(500).json({
            error:err
        })
    })
}

exports.getMyPoll = (req,res)=>{
    PollUser.findById({_id:req.params.id})
    .then(doc=>{
        res.status(200).json({
            message:"found polls",
            polls:doc.polls
        })
    }).catch(err=>{
        console.log(err)
        res.status(500).json({
            error:err
        })
    })
}

exports.getPoll = (req,res)=>{
    console.log(req.params.poll)
    PollUser.findById({_id:req.params.userid})
    .then(doc=>{
        let currPoll
        console.log(doc.polls)
        doc.polls.map(poll=>{
            if(String(poll._id)===String(req.params.poll)){
                currPoll = poll
                return
            }
        })
        res.status(200).json({
            message:"found poll",
            poll:currPoll
        })
    }).catch(err=>{
        console.log(err)
        res.status(500).json({
            error:err
        })
    })
}

exports.deletePoll = async(req,res)=>{
    let userPolls
    
    await PollUser.findById({_id:req.body.userid})
    .then(doc=>{
        userPolls = doc.polls
        userPolls.map((poll,index)=>{
            if(String(req.body.poll)===String(poll._id)){
                userPolls.splice(index,1)
                return
            } 
        })
        console.log(userPolls)
    }).catch(err=>{
        console.log(err)
        res.status(500).json({
            error:err
        })
    })

    await PollUser.findByIdAndUpdate({_id:req.body.userid},{$set:{polls:userPolls}})
    .then(doc=>{
        res.status(200).json({
            message:"deleted poll successfully"
        })
    }).catch(err=>{
        console.log(err)
        res.status(500).json({
            error:err
        })
    })
    
}

exports.vote = async(req,res)=>{
    let userPolls
    let requiredPoll
    let candidates
    let voters

    await PollUser.findById({_id:req.body.userid})
    .then(doc=>{
        userPolls = doc.polls
        requiredPoll=userPolls.map(poll=>{
            let flag=0;
            if(String(req.body.poll)===String(poll._id)){
                candidates = poll.options
                candidates.map(candidate=>{
                    if(String(candidate._id)===String(req.body.candidate)){
                        candidate.count+=1
                        flag=1
                        return
                    }
                })
                if(flag==1){
                    // voters = poll.voters
                    poll.voters.push(req.body.voter)
                    return
                }
            }
        })
    })

    await PollUser.findByIdAndUpdate({_id:req.body.userid},{$set:{polls:userPolls}},{new:true})
    .then(doc=>{
        res.status(200).json({
            message:"voted successfully",
            doc:doc
        })
    }).catch(err=>{
        console.log(err)
        res.status(500).json({
            error:err
        })
    })
}