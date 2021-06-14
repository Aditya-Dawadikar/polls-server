const PollUser = require('./PollModel')

exports.signup = (req,res)=>{
    let newUser = new PollUser({
        username:req.body.username,
        password:req.body.password,
        polls:[]
    })

    newUser.save()
    .then(doc=>{
        res.status(200).json({
            message:"user saved successfully",
            doc: doc
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
    let userPolls;
    await PollUser.findOne({_id:req.body.id})
    .then((doc)=>{
        userPolls = doc.polls
        userPolls.push(newPoll)
    }).catch(err=>{
        console.log(err)
        res.status(500).json({
            error:err
        })
    })
    await PollUser.findByIdAndUpdate({_id:req.body.id},{$set:{polls:userPolls}})
    .then(doc=>{
        console.log(doc)
        res.status(200).json({
            message:"new poll created",
            poll:doc._id
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
                    return
                }
            }
        })
    })

    await PollUser.findByIdAndUpdate({_id:req.body.userid},{$set:{polls:userPolls}})
    .then(doc=>{
        res.status(200).json({
            message:"voted successfully"
        })
    }).catch(err=>{
        console.log(err)
        res.status(500).json({
            error:err
        })
    })
}