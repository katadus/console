import React from 'react';
import styled from 'styled-components';
import { Separator } from '@kyma-project/react-components';
import { ACTIVE_COLOR } from '../../commons/variables';

const NavigationContainer = styled.div`
  box-sizing: border-box;
  width: 300px;
  padding: 7px 30px;
  text-align: left;
`;

const NavigationHeader = styled.div`
  font-family: '72';
  font-size: 12px;
  font-weight: 300;
  text-align: left;
  color: rgba(63, 80, 96, 0.6);
  padding: 10px 0;
  text-transform: uppercase;
`;

const Items = styled.ul`
  margin: 0;
  margin-top: ${props => (props.marginTop ? '10px' : '0')};
  margin-bottom: ${props => (props.marginTop ? '-10px' : '0')};
  margin-left: ${props => (props.secondary ? '10px' : '0')};
  padding: 0;
  max-height: ${props =>
    (props.show && '9000px') || (props.showAll && 'auto') || '0'};
  overflow: ${props => (props.show ? 'auto' : 'hidden')};
  transition: ${props =>
    props.show ? 'max-height 2.1s ease-out' : 'max-height 0.3s ease-in'};
  transition-delay: ${props => (props.show ? '0.2s' : '0')};
`;

const Item = styled.li`
  display: block;
  padding: 10px 0;
`;

const LinkWrapper = styled.div`
  position: relative;
`;
const Arrow = styled.a`
  width: 16px;
  height: 100%;
  display: block;
  position: absolute;
  z-index: 50;
  cursor: pointer;
  :before {
    content: '';
    display: 'block';
    width: 0;
    height: 0;
    border-top: 3px solid transparent;
    border-bottom: 3px solid transparent;
    border-left: ${props =>
      props.active
        ? `3px solid ${ACTIVE_COLOR}`
        : '3px solid rgba(50,54,58,0.6)'};
    left: 2px;
    top: 50%;
    position: absolute;
    transform: translateY(-50%);
    transform: ${props =>
      props.activeArrow
        ? 'translateY(-50%) rotate(90deg)'
        : 'translateY(-50%)'};
  }
`;
const Link = styled.a`
  color: ${props => (props.active ? ACTIVE_COLOR : '#32363a')};
  font-family: '72';
  font-size: 14px;
  font-weight: ${props => (props.active ? 'bold' : 'normal')};
  display: block;
  border: 1px solid transparent;
  border-left: ${props =>
    props.active && props.noArrow ? '3px solid' : '1px solid transparent'};
  padding-left: 6px;
  margin-left: 10px;
  position: relative;
  :hover {
    color: ${ACTIVE_COLOR};
    cursor: pointer;
  }
`;

function SecondarySubLink(props) {
  const { rootId, type, items, active, activeNav } = props;
  let onClick = clickedItem => {
    props.callbackParent(clickedItem);
  };
  let setActiveNav = clickedItem => {
    props.setActiveNav(clickedItem);
  };
  return (
    <Items secondary marginTop show={activeNav.id === rootId}>
      {items.map((item, index) => {
        const topicType = item.topicType.replace(/ /g, '-').toLowerCase();
        return (
          <Item key={`${rootId}-${index}`}>
            {item &&
              item.titles &&
              item.titles.map(element => {
                const hash = `${topicType}-${element.anchor}`;
                const isActive =
                  active.hash && active.id === rootId && active.hash === hash;
                const hasSubElements =
                  element && element.titles && element.titles.length > 0;

                const isActiveNavArrow =
                  hasSubElements &&
                  activeNav.id === rootId &&
                  activeNav.hash &&
                  activeNav.hash.indexOf(element.anchor) !== -1;

                return (
                  <div key={`${rootId}-${element.anchor}`}>
                    <LinkWrapper>
                      {hasSubElements && (
                        <Arrow
                          onClick={() => {
                            setActiveNav({
                              id: rootId,
                              type: type,
                              hash: hash,
                            });
                          }}
                          active={isActive}
                          activeArrow={isActiveNavArrow}
                        />
                      )}
                      <Link
                        active={isActive}
                        noArrow={!hasSubElements}
                        onClick={() => {
                          onClick({
                            id: rootId,
                            type: type,
                            hash: hash,
                          });
                        }}
                      >
                        {element.name}
                      </Link>
                    </LinkWrapper>
                    {hasSubElements && (
                      <TertiarySubLink
                        items={element}
                        type={type}
                        rootId={rootId}
                        parentId={element.anchor}
                        history={props.history}
                        active={active}
                        activeNav={activeNav}
                        callbackParent={props.callbackParent}
                        topicType={topicType}
                      />
                    )}
                  </div>
                );
              })}
          </Item>
        );
      })}
    </Items>
  );
}

function TertiarySubLink(props) {
  const { rootId, parentId, type, items, active, activeNav } = props;
  let onClick = clickedItem => {
    props.callbackParent(clickedItem);
  };

  const isActiveNav =
    activeNav.id === rootId &&
    activeNav.hash &&
    activeNav.hash.indexOf(parentId) !== -1;
  return (
    <Items secondary marginTop show={isActiveNav}>
      {items &&
        items.titles &&
        items.titles.map(element => {
          const isActive =
            active.hash &&
            active.id === rootId &&
            active.hash === `${parentId}-${element.anchor}`;

          return (
            <Item key={`${rootId}-${parentId}-${element.anchor}`}>
              <LinkWrapper>
                <Link
                  active={isActive}
                  noArrow
                  onClick={() => {
                    onClick({
                      id: rootId,
                      type: type,
                      hash: `${parentId}-${element.anchor}`,
                    });
                  }}
                >
                  {element.name}
                </Link>
              </LinkWrapper>
            </Item>
          );
        })}
    </Items>
  );
}

function NavigationList(props) {
  let onClick = clickedItem => {
    props.callbackParent(clickedItem);
  };
  let setActiveNav = clickedItem => {
    props.setActiveNav(clickedItem);
  };
  return (
    <div>
      <NavigationContainer>
        <Items showAll>
          <Item key={props.items.root.id}>
            <LinkWrapper>
              {props.topics && (
                <Arrow
                  onClick={() => {
                    setActiveNav({
                      id: props.items.root.id,
                      type: 'root',
                      hash: '',
                    });
                  }}
                  activeArrow={props.items.root.id === props.activeNav.id}
                  active={
                    !props.active.hash &&
                    props.active.id === props.items.root.id
                  }
                />
              )}
              <Link
                active={
                  !props.active.hash && props.active.id === props.items.root.id
                }
                onClick={() => {
                  onClick({
                    id: props.items.root.id,
                    type: 'root',
                    hash: '',
                  });
                }}
              >
                {props.items.root.displayName}
              </Link>
            </LinkWrapper>
            {props.topics && (
              <SecondarySubLink
                items={
                  props.topics.find(obj => obj.id === props.items.root.id)
                    .sections
                }
                type="root"
                rootId={props.items.root.id}
                active={props.active}
                activeNav={props.activeNav}
                history={props.history}
                callbackParent={props.callbackParent}
                setActiveNav={props.setActiveNav}
              />
            )}
          </Item>
        </Items>
      </NavigationContainer>
      <Separator />
      <NavigationContainer>
        <NavigationHeader>Components</NavigationHeader>
        <Items showAll>
          {props.items.components.map(item => {
            let topics = null;
            if (props.topics) {
              topics = props.topics.find(obj => obj.id === item.id);
            }
            return (
              <Item key={item.id}>
                <LinkWrapper>
                  {topics &&
                    topics.sections && (
                      <Arrow
                        onClick={() => {
                          setActiveNav({
                            id: item.id,
                            type: 'components',
                            hash: '',
                          });
                        }}
                        activeArrow={item.id === props.activeNav.id}
                        active={
                          !props.active.hash && props.active.id === item.id
                        }
                      />
                    )}
                  <Link
                    active={!props.active.hash && props.active.id === item.id}
                    onClick={() =>
                      onClick({
                        id: item.id,
                        type: 'components',
                        hash: '',
                      })
                    }
                  >
                    {item.displayName}
                  </Link>
                </LinkWrapper>
                {topics &&
                  topics.sections && (
                    <SecondarySubLink
                      items={topics.sections}
                      type="components"
                      rootId={item.id}
                      active={props.active}
                      activeNav={props.activeNav}
                      history={props.history}
                      callbackParent={props.callbackParent}
                      setActiveNav={props.setActiveNav}
                    />
                  )}
              </Item>
            );
          })}
        </Items>
      </NavigationContainer>
    </div>
  );
}

export default NavigationList;
