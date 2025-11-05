import { useState, useEffect } from 'react';
import { ThumbsUp, Heart, Award, Star } from 'lucide-react';
import { postService } from '../../services/postService';
import './ReactionBar.css';
import toast from 'react-hot-toast';

const ReactionBar = ({ postId, currentUser }) => {
  const [reactionCounts, setReactionCounts] = useState({});
  const [userReactions, setUserReactions] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReactions = async () => {
      setLoading(true);
      try {
        // Get reaction counts for the post
        const counts = await postService.getReactionCounts(postId);
        setReactionCounts(counts || {});
        
        // If we have a user, check if they've reacted to this post
        if (currentUser?.id) {
          try {
            const reactions = await postService.getReactionsByPostId(postId);
            
            // Filter reactions by the current user
            const userReacs = reactions
              .filter(r => r.userId === currentUser.id)
              .reduce((acc, r) => {
                acc[r.reactionType] = true;
                return acc;
              }, {});
              
            setUserReactions(userReacs);
          } catch (error) {
            console.error('Error fetching user reactions:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching reactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReactions();
  }, [postId, currentUser?.id]);

  const handleReaction = async (reactionType) => {
    if (!currentUser?.id) {
      toast.error('Please log in to react to posts');
      return;
    }
    
    try {
      const reaction = {
        postId,
        userId: currentUser.id,
        reactionType
      };
      
      // Call the API to toggle the reaction
      await postService.addReaction(reaction);
      
      // Toggle the state for immediate UI update
      const isActive = userReactions[reactionType];
      
      if (isActive) {
        // Removing reaction
        setReactionCounts({
          ...reactionCounts,
          [reactionType]: Math.max(0, (reactionCounts[reactionType] || 0) - 1)
        });
      } else {
        // Adding reaction
        setReactionCounts({
          ...reactionCounts,
          [reactionType]: (reactionCounts[reactionType] || 0) + 1
        });
      }
      
      // Update user's reaction state
      setUserReactions({
        ...userReactions,
        [reactionType]: !isActive
      });
      
      toast.success(`${reactionType} reaction toggled`);
    } catch (error) {
      console.error('Error updating reaction:', error);
      toast.error('Failed to process reaction');
    }
  };

  if (loading) {
    return <div className="reaction-bar skeleton"></div>;
  }

  return (
    <div className="reaction-bar">
      <button 
        className={`reaction-button ${userReactions.LIKE ? 'active' : ''}`}
        onClick={() => handleReaction('LIKE')}
        aria-label="Like"
      >
        <ThumbsUp size={18} />
        <span>{reactionCounts.LIKE || 0}</span>
      </button>
      
      <button 
        className={`reaction-button ${userReactions.LOVE ? 'active' : ''}`}
        onClick={() => handleReaction('LOVE')}
        aria-label="Love"
      >
        <Heart size={18} />
        <span>{reactionCounts.LOVE || 0}</span>
      </button>
      
      <button 
        className={`reaction-button ${userReactions.CLAP ? 'active' : ''}`}
        onClick={() => handleReaction('CLAP')}
        aria-label="Clap"
      >
        <Award size={18} />
        <span>{reactionCounts.CLAP || 0}</span>
      </button>

      <button 
        className={`reaction-button ${userReactions.STAR ? 'active' : ''}`}
        onClick={() => handleReaction('STAR')}
        aria-label="Star"
      >
        <Star size={18} />
        <span>{reactionCounts.STAR || 0}</span>
      </button>
    </div>
  );
};

export default ReactionBar; 