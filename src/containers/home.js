import React from 'react';
import MasonCards from '../components/cards/masonCards';
import LayoutOptions from '../components/layoutOptions/layoutOptions';
import ListCards from '../components/cards/listCards';

let user = JSON.parse(localStorage.getItem('profile'));

const Home = ({
  resources,
  isSignedIn,
  onClick,
  display,
  changeDisplay,
  updateVotes
}) => {
  const cardView = {
    tableview: 'px-5 mt-3',
    masonry: 'card-columns px-5 mt-3'
  };

  const submitUpvote = slug => {
    if (isSignedIn) {
        fetch(
          `https://dev-resources.herokuapp.com/resource/${slug}/${user.id}/upvote`,
          {
            method: 'post'
          }
        )
          .then(res => res.json())
          .catch(error => console.error('Error:', error));

        updateVotes();
    } else  {
        alert("Action require user account. \n //To be replaced with modal");
    }
  };

  const hasVoted = (upArry) => {
    if (isSignedIn) {
        if (upArry.includes(user.id)) return true;
        else return false;
    }
  };

  return (
    <div>
      {user = JSON.parse(localStorage.getItem('profile'))}
      <div className="speech-bubble" role="alert">
        Heads up! This is still very much a work in progress. Some aspects may
        take a while to load, contain bugs or be completely non functional
      </div>

      <LayoutOptions display={display} changeDisplay={changeDisplay} />
      <p className="text-white text-center">
        Displaying: {Object.keys(resources).length} Resources
      </p>
      <div className={cardView[display]}>
      {console.log(resources)}
        {resources.map((res, i) => {
          if (display === 'tableview')
            return (
              <ListCards
                key={i}
                index={i}
                resource={res}
                onClick={onClick}
                upvote={() => submitUpvote(res.slug)}
                hasVoted={hasVoted(res.upvotes)}
              />
            );
          else
            return (
              <MasonCards
                key={i}
                index={i}
                resource={res}
                onClick={onClick}
                upvote={() => submitUpvote(res.slug)}
                hasVoted={hasVoted(res.upvotes)}
              />
            );
        })}
      </div>
    </div>
  );
};

export default Home;
