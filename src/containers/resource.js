import React from 'react';
import ResourceFound from './resourceFound';
import ResourceNotFound from './resourceNotFound';

const Resource = ({ res }) => {
  if (res) return <ResourceFound res={res} />;
  else return <ResourceNotFound />;
};

export default Resource;
