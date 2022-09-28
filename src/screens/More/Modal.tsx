import {View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {DataList, ModalTopBar} from '../../components';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import {actions as userDataActions} from '../../redux/actions';
import {globalStyles} from '../../styles';

export const Modal = () => {
  const [addingText, setAddingText] = useState<boolean>(false);
  const [text, setText] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const {postsData, isLoading} = useSelector(
    (state: RootState) => state.userPosts,
  );
  const dispatch = useDispatch<AppDispatch>();

  const fetchUserPostData = useCallback(() => {
    dispatch(userDataActions.getUserPostData());
  }, [dispatch]);

  useEffect(() => {
    if (postsData.length === 0) {
      fetchUserPostData();
    }
  }, [postsData.length, fetchUserPostData]);

  const onCloseAddingText = () => {
    setAddingText(false);
    setText('');
  };

  const onPressAdd = () => {
    setAddingText(true);
  };

  const onPressDone = () => {
    if (text.trim() !== '') {
      dispatch(
        userDataActions.addNewPostText({
          user_id: Math.random() * 10 ** 5,
          id: Math.random() * 10 ** 5,
          title: text,
          body: text,
          created_by: 'user',
        }),
      );
    }
    onCloseAddingText();
  };

  const onRefreshList = () => {
    setIsRefreshing(true);
    fetchUserPostData();
    setIsRefreshing(false);
  };

  return (
    <View style={globalStyles.fullScreenContainerWhite}>
      <ModalTopBar
        title={addingText ? 'Adding data' : 'My Modal'}
        showBack={addingText}
        showNext={!addingText}
        onPressBack={onCloseAddingText}
        onPressNext={onPressAdd}
      />
      <DataList
        data={postsData}
        isLoading={isLoading}
        refreshing={isRefreshing}
        onRefresh={onRefreshList}
        text={text}
        onPressDone={onPressDone}
        onTextChange={val => setText(val)}
        addNexText={addingText}
      />
    </View>
  );
};
