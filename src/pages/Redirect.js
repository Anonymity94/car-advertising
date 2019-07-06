import React, { memo } from 'react';
import { getAuthority } from '@/utils/authority';
import Redirect from 'umi/redirect';

const RedirectPage = memo(() => {
  const auth = getAuthority();
  if (auth.indexOf('admin') > -1) {
    return <Redirect to="/workplace" />;
  }
  if (auth.indexOf('business') > -1) {
    return <Redirect to="/index" />;
  }

  return <Redirect to="/login" />;
});

export default RedirectPage;
