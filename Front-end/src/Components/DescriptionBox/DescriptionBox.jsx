import React, { useState, useEffect } from 'react';
import './DescriptionBox.css';
import q_logo from '../Assets/question_logo.jpeg';
import a_logo from '../Assets/answer_logo.jpg';

const DescriptionBox = ({ product }) => {
  const [activeTab, setActiveTab] = useState('description');
  const [qna, setQna] = useState([]);
  const [comments, setComments] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState('');
  const [ratingText, setRatingText] = useState('');
  const [newAnswer, setNewAnswer] = useState({});

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    fetchQna();
    fetchComments();
  }, []);

  const fetchQna = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/item/QA?item_id=${product.item_id}`);
      const data = await response.json();
      setQna(data);
    } catch (error) {
      console.error('Error fetching Q&A:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/item/comment_show?id=${product.item_id}`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handlePostQuestion = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('Please log in to post a question.');
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    const questionData = {
      question_text: newQuestion,
    };

    try {
      const response = await fetch(`http://127.0.0.1:8000/item/question?id=${product.item_id}`, {
        method: 'POST',
        headers: config.headers,
        body: JSON.stringify(questionData),
      });
      if (response.ok) {
        alert('Question posted successfully!');
        setNewQuestion('');
        fetchQna();
      } else {
        const data = await response.json();
        alert(data.detail);
      }
    } catch (error) {
      console.error('Error posting question:', error);
    }
  };

  const handlePostComment = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('Please log in to post a comment.');
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    const commentData = {
      text: newComment,
    };

    try {
      const response = await fetch(`http://127.0.0.1:8000/item/comment?id=${product.item_id}`, {
        method: 'POST',
        headers: config.headers,
        body: JSON.stringify(commentData),
      });
      if (response.ok) {
        alert('Comment posted successfully!');
        setNewComment('');
        fetchComments();
      } else {
        const data = await response.json();
        alert(data.detail);
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handlePostRating = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('Please log in to post a rating.');
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    const ratingData = {
      user_id_from: product.seller.phone,
      rating: newRating,
      text: ratingText,
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/rate/give', {
        method: 'POST',
        headers: config.headers,
        body: JSON.stringify(ratingData),
      });
      if (response.ok) {
        alert('Rating posted successfully!');
        setNewRating('');
        setRatingText('');
      } else {
        const data = await response.json();
        alert(data.detail);
      }
    } catch (error) {
      console.error('Error posting rating:', error);
    }
  };

  const handlePostAnswer = async (questionId) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('Please log in to post an answer.');
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    const answerData = {
      answer_text: newAnswer[questionId] || '',
    };

    try {
      const response = await fetch(`http://127.0.0.1:8000/item/answer?id=${questionId}`, {
        method: 'POST',
        headers: config.headers,
        body: JSON.stringify(answerData),
      });
      if (response.ok) {
        alert('Answer posted successfully!');
        setNewAnswer((prevAnswers) => ({ ...prevAnswers, [questionId]: '' }));
        fetchQna();
      } else {
        const data = await response.json();
        alert(data.detail);
      }
    } catch (error) {
      console.error('Error posting answer:', error);
    }
  };

  const handleAnswerChange = (questionId, text) => {
    setNewAnswer((prevAnswers) => ({ ...prevAnswers, [questionId]: text }));
  };

  return (
    <div className='descriptionbox'>
      <div className="descriptionbox-navigator">
        <div
          className={`descriptionbox-nav-box ${activeTab === 'description' ? 'active' : 'fade'}`}
          onClick={() => handleTabClick('description')}
        >
          Description
        </div>
        <div
          className={`descriptionbox-nav-box ${activeTab === 'qa' ? 'active' : 'fade'}`}
          onClick={() => handleTabClick('qa')}
        >
          Q&A ({qna.length})
        </div>
        <div
          className={`descriptionbox-nav-box ${activeTab === 'comment' ? 'active' : 'fade'}`}
          onClick={() => handleTabClick('comment')}
        >
          Comment ({comments.length})
        </div>
        <div
          className={`descriptionbox-nav-box ${activeTab === 'rating' ? 'active' : 'fade'}`}
          onClick={() => handleTabClick('rating')}
        >
          Ratings
        </div>
      </div>
      <div className="descriptionbox-description">
        {activeTab === 'description' && (
          <div className="description-section">
            <p><strong>Seller Name: </strong>{product.seller.name}</p>
            <p>{product.description}</p>
          </div>

        )}
        {activeTab === 'qa' && (
          <div className="qa-section">
            {qna.map((item, i) => (
              <div key={i} className="question-answer">
                <div className="question-side">
                  <img src={q_logo} alt="" />
                  <p className="question-name">{item.user.name}</p>
                  <p className="question">{item.question_text}</p>
                  <p className="question-name-time">{item.timestamp}</p>
                </div>
                <div className="answer-section">
                  <input
                    className="qsic"
                    type="text"
                    placeholder="Answer here"
                    value={newAnswer[item.question_id] || ''}
                    onChange={(e) => handleAnswerChange(item.question_id, e.target.value)}
                  />
                  <button className="qsbc" onClick={() => handlePostAnswer(item.question_id)}>
                    Post Answer
                  </button>
                </div>
                <div className="answer-side">
                  {item.answers.length > 0 ? (
                    item.answers.map((answer, j) => (
                      <div key={j} className="answer-wrapper">
                        <img src={a_logo} alt="" className="answer-logo" />
                        <p className="answer-name">{answer.user.name}</p>
                        <p className="answer">{answer.answer_text}</p>
                        <p className="answer-name-time">{answer.timestamp}</p>
                      </div>
                    ))
                  ) : (
                    <p>No answers available</p>
                  )}
                </div>
              </div>
            ))}
            <div className="question-post-section">
              <input
                className="qsic"
                type="text"
                placeholder="Ask a question"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
              />
              <button className="qsbc" onClick={handlePostQuestion}>
                Post Question
              </button>
            </div>
          </div>
        )}
        {activeTab === 'comment' && (
          <div className="comment-section">
            {comments.map((comment, index) => (
              <div key={index} className="comment">
                <p className='comment-p1'>{comment.user.name} : </p>
                <p className='comment-p2'>{comment.text}</p>
                <p className='comment-p3'>{comment.timestamp}</p>
              </div>
            ))}
            <div className="comment-post-section">
              <input
                className="qsicm"
                type="text"
                placeholder="Write a comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button className="qsbcm" onClick={handlePostComment}>
                Post Comment
              </button>
            </div>
          </div>
        )}
        {activeTab === 'rating' && (
          <div className="rating-section">
            <div className="rating-post-section">
              <input
                className="qsicm"
                type="number"
                placeholder="Give a rating (1-5)"
                value={newRating}
                onChange={(e) => setNewRating(e.target.value)}
                min="1"
                max="5"
              />
              <textarea
                className="rating-text"
                placeholder="Write a review"
                value={ratingText}
                onChange={(e) => setRatingText(e.target.value)}
              />
              <button className="qsbcm" onClick={handlePostRating}>
                Submit Rating
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DescriptionBox;
