import React, { useContext } from 'react';
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'

import { Link } from 'react-router-dom'
import { Card, Grid, Icon, Button, Image, Label } from 'semantic-ui-react';
import moment from 'moment';

import { AuthContext } from '../context/auth';
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton'

function SinglePost(props) {
    const postId = props.match.params.postId
    const { user } = useContext(AuthContext)
    
    const {data={}} = useQuery(FETCH_POST_QUERY,{
    variables: {
      postId
    }
  });
const thisPost = data.getPost;
    let postMarkup;
    if (!thisPost) {
      postMarkup = <p>Loading post..</p>
    } else {
      const { id, body, createdAt, username, comments, likes, likesCount, commentCount } = thisPost;

        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                    <Image
                    src="https://react.semantic-ui.com/images/avatar/large/molly.png"
                    size="small"
                    float="right" />
                    </Grid.Column>
                    <Grid.Column width={10}>
                     <Card>
                       <Card.Content>
                         <Card.Header>{username}</Card.Header>
                         <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                        <Card.Description>{body}</Card.Description>
                       </Card.Content>
                       <hr />
                       <Card.Content extra>
                           <LikeButton user={user} post={{ id, likesCount, likes }} />
                           <Button labelPosition='right' as={Link} to={`/posts/${id}`}>
      <Button color='blue' basic>
        <Icon name='comments' />
        
      </Button>
      <Label basic color='blue' pointing='left'>
        {commentCount}
      </Label>
    </Button>
    {user && user.username === username && <DeleteButton postId={id} />}
                       </Card.Content>
                    </Card>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
    return postMarkup;
}

const FETCH_POST_QUERY = gql`
  query($postId: String!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likesCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export default SinglePost;