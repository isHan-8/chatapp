import React, { useState } from 'react'
import "./post.css";
import ProfileImage from "../Images/Profile.png"
import LikeIcon from "../Images/like.png";
import CommentIcon from "../Images/speech-bubble.png";
import Shareicon from "../Images/share.png";
import Moreoption from "../Images/more.png";
import anotherlikeicon from "../Images/setLike.png"
import { useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
export default function Post({post}) {
    
    const userDetails = useSelector((state)=>state.user);
    let users = userDetails?.user
    const [user , setuser] = useState([]);

    useEffect(() => {
      const getuser = async()=>{
        try {
          const res  = await axios.get(`http://localhost:5000/api/user/post/user/details/${post.user}`)
          setuser(res.data);
        } catch (error) {
          console.log("Some error occured")
        }
      }
      getuser();
    }, [])
//  const userId = "65e77881dd2a862fbeb5d644";
//  const accesstoken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZTc3ODgxZGQyYTg2MmZiZWI1ZDY0NCIsInVzZXJuYW1lIjoiUml5YSIsImlhdCI6MTcwOTkwNzk5MX0.XseOnsK4cXke7lrGxo1H4o8PomipNvLxLg7AX7hauYE";
const userId = users?.other._id;
const accessToken = users?.accessToken;

const [Like, setLike] = useState([post.like.includes(userId) ? anotherlikeicon : LikeIcon]);
const [count, setCount] = useState(post.like.length);
const [Comments, setComments] = useState(post.comments);
const [commentwriting, setcommentwriting] = useState('');
const [show, setshow] = useState(false);
    
  
    
    const handleLike = async () => {
        if (Like == LikeIcon) {
            await fetch(`http://localhost:5000/api/post/${post._id}/like` , {method:"PUT" , headers:{'Content-Type':"application/Json" , token:accessToken} ,body:JSON.stringify({user: "65e77881dd2a862fbeb5d644"})})
            setLike(anotherlikeicon);
            setCount(count + 1);
        } else {
            await fetch(`http://localhost:5000/api/post/${post._id}/dislike` , {method:"PUT" , headers:{'Content-Type':"application/Json" , token:accessToken} , body:JSON.stringify({user: "65e77881dd2a862fbeb5d644"})})
            setLike(LikeIcon)
            setCount(count - 1);
        }
    }

    const addComment = async() => {
        const comment = {
            "postid": `${post._id}`,
      "username": `${users.other.username}`,
      "comment": `${commentwriting}`,
      "profile":`${users.other?.profile}`

        }
        
        await fetch(`http://localhost:5000/api/post/comment/post` , {method:"PUT" , headers:{'Content-Type':"application/Json" , token:accessToken} , body:JSON.stringify(comment)})
        setComments(Comments.concat(comment));
    }

    const handleComment = () => {
        addComment();
    }

    console.log(Comments)

    const handleshow = () => {
        if (show === false) {
            setshow(true)
        } else {
            setshow(false)
        }
    }
    console.log(user);

    return (
        <div className='PostContainer' >
            <div className='SubPostContainer' >
                <div>
                    <div style={{ display: 'flex', alignItems: 'center' }} >
                     {user.profile === ""? <img src={`${ProfileImage}`} className="PostImage" alt="" /> : <img src={`${user.profile}`} className="PostImage" alt="" />}
            

                        <div>

                            <p style={{ marginLeft: '5px', textAlign: 'start' }} >{user.username}</p>
                            <p style={{ fontSize: '11px', textAlign: 'start', marginLeft: 5, marginTop: '-13px', color: '#aaa' }} >Following by Suman</p>
                        </div>
                        <img src={`${Moreoption}`} className='moreicons' alt="" />
                    </div>
                    <p style={{ textAlign: 'start', width: '96%', marginLeft: 10, marginTop: 0 }} >{post.title}</p>
                    {post.image !== '' ? 
           <img src={`${post.image}`} className="PostImages" alt="" />: post.video !== '' ? <video className="PostImages" width="500" height="500" controls >
           <source src={`${post.video}`} type="video/mp4"/>
          </video> : ''
          }
                    {/* <img src={`${post.image}`} className='PostImages' alt="" /> */}
                    <div style={{ display: 'flex' }} >
                        <div style={{ display: 'flex', marginLeft: '10px' }} >


                            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} >
                                <img src={`${Like}`}  className='iconsforPost' onClick={handleLike} alt="" />
                                <p style={{ marginLeft: '10px' }} >{count} Likes</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', marginLeft: 20, cursor: 'pointer' }} >
                                <img src={`${CommentIcon}`} className='iconsforPost' onClick={handleshow} alt="" />
                                <p style={{ marginLeft: '10px' }}  >{Comments.length} Comments</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', marginLeft: 180, cursor: 'pointer' }} >
                                <img src={`${Shareicon}`} className='iconsforPost' alt="" />
                                <p style={{ display: 'flex', marginLeft: '10px' }}>Share</p>
                            </div>
                        </div>
                    </div>

                    {show === true ?

                        <div style={{padding: '10px'}} >


                            {/* yaha se gadbad start hogyi hai  */}
                            <div style={{ display: 'flex', alignItems: 'center' }} >
                                <img style={{ display: 'flex' }} src={`${users?.other?.profile}`} className='PostImage' alt="" />
                                {/* <p style={{display:'flex' , marginLeft:'6px'}} > Suman</p> */}
                                <input type="text" className='commentinput' placeholder='write your thought' onChange={(e) => setcommentwriting(e.target.value)} />
                                <button className='addCommentbtn' onClick={handleComment}>Post</button>
                            </div>
                            <div>
                         
                                {Comments.map((item) => (

                                    <div style={{ alignItems:'center'}} >
                                        <div style={{ display: 'flex', alignItems: 'center' }} >
                                       
                                            <img style={{ display: 'flex' }} src={users?.other?.profile} className='PostImage' alt="" />
                                            <p style={{ marginLeft: '6px' , fontSize:18 , marginTop:6 }}>{item.username}</p>
                                            </div>
                                            <p style={{ marginLeft: '55px' , textAlign:'start' ,marginTop:-16}} >{item.comment}</p>
                                            <p style={{ marginLeft: '55px' , textAlign:'start' ,marginTop:-10 , color:'#aaa' , fontSize:10}} >reply</p>


                                            {/* <input type="text" className='commentinput' placeholder='write your thought' onChange={(e) => setcommentwriting(e.target.value)} /> */}
                                            {/* <button className='addCommentbtn' onClick={handleComment} >Add Comment</button> */}
                                        </div>
                                  
                                ))}

                            </div>
                    
                      
                        </div>:''  
                    } 
                </div>
                    
                </div>
            </div>
            

       

    )
}




