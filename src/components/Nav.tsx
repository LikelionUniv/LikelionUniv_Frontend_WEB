// 모바일 뷰 스타일 적용 필요

import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate, NavLink } from 'react-router-dom';
import logo from '../img/nav/logo.svg';
import navarrow from '../img/nav/nav_arrow.svg';
import chat from '../img/nav/chat.svg';
import defaultprofile from '../img/nav/default_profile.svg';
import mypage from '../img/nav/mypage.svg';
import logout from '../img/nav/logout.svg';
import { ReactComponent as Arrow } from '../img/arrow.svg';
import { ReactComponent as HeaderMenu } from '../img/header-menu.svg';
import { ReactComponent as CloseButton } from '../img/button_close.svg';


const Nav = () => {
    const navigate = useNavigate();
    // 로그인 상태
    const [isLogin, setIsLogin] = useState<Boolean>(true);

    // 네비게이션 바 스크롤 감지에 따른 상태
    const [position, setPosition] = useState(window.pageYOffset);
    const [visible, setVisible] = useState<Boolean | undefined>(undefined);
    useEffect(() => {
        const handleScroll = () => {
            const moving = window.pageYOffset;
            // 프로필 모달(마이페이지, 로그아웃 창)이 켜져 있으면 스크롤 내려도 없어지지 않음
            if (!profileModal) setVisible(position > moving);
            setPosition(moving);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [position]);

    // 프로필 버튼 창 상태
    const [profileModal, setProfileModal] = useState<Boolean>(false);
    // 프로필 버튼 참조
    const buttonRef = useRef<HTMLDivElement>(null);
    // 프로필 모달 참조
    const modalRef = useRef<HTMLDivElement>(null);
    // 프로필 모달이 아닌 곳을 누르면 (버튼 포함) 모달이 꺼짐
    useEffect(() => {
        const clickOutside = (e: any) => {
            if (
                profileModal &&
                modalRef.current &&
                !modalRef.current.contains(e.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(e.target)
            ) {
                setProfileModal(false);
            }
        };
        document.addEventListener('mousedown', clickOutside);
        return () => {
            document.removeEventListener('mousedown', clickOutside);
        };
    }, [profileModal]);

    const [menuOpen, setMenuOpen] = useState(true);
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
      };
    

    return (
        <Wrapper className={visible === false ? 'fade-out' : visible === true ? 'fade-in' : undefined}>
            <Container>
                <Logo src={logo} onClick={() => navigate('/')} />
                
                {/* 데스크탑 네비게이션 링크 */}
                <DesktopNavLinks>
                    <Text to="/recruit">
                        <p>리크루팅</p>
                        <img src={navarrow} />
                    </Text>
                    <Text to="/univ">
                        <p>참여대학</p>
                        <img src={navarrow} />
                    </Text>
                    <Text to="/project">
                        <p>프로젝트</p>
                    <img src={navarrow} />
                    </Text>
                    <Text to="/community">
                        <p>커뮤니티</p>
                        <img src={navarrow} />
                    </Text>
                </DesktopNavLinks>

                {/* 모바일 메뉴 버튼 */}
                <MobileMenuIcon onClick={toggleMenu}>
                {menuOpen ? <CloseButton /> : <HeaderMenu />}
                </MobileMenuIcon>

                {/* 모바일 메뉴 드롭다운 */}
                {menuOpen && (
                <MobileMenu className={visible ? 'menu-visible' : 'menu-hidden'}>
                    <MobileNavLink to="/recruit" onClick={toggleMenu}>리크루팅</MobileNavLink>
                    <MobileNavLink to="/univ" onClick={toggleMenu}>참여대학</MobileNavLink>
                    <MobileNavLink to="/project" onClick={toggleMenu}>프로젝트</MobileNavLink>
                    <MobileNavLink to="/community" onClick={toggleMenu}>커뮤니티</MobileNavLink>
                </MobileMenu>
                )}
                <div className="right" style={{ visibility: 'hidden' }}>
                    {isLogin ? (
                        <>
                            <ChatBtn to="/chat">
                                <img src={chat} />
                            </ChatBtn>
                            <ProfileBtn
                                ref={buttonRef}
                                onClick={() => setProfileModal(!profileModal)}
                                style={{
                                    backgroundColor: profileModal
                                        ? 'var(--grey-300, #eaecee)'
                                        : '',
                                }}
                            >
                                <div className="profile-img">
                                    <img src={defaultprofile} />
                                </div>
                                <Arrow
                                    style={{
                                        transform: profileModal
                                            ? 'rotate(0deg)'
                                            : 'rotate(180deg)',
                                        stroke: '#868C94',
                                    }}
                                />
                            </ProfileBtn>
                        </>
                    ) : (
                        <LoginBtn onClick={() => navigate('/login')}>
                            로그인
                        </LoginBtn>
                    )}
                </div>
                {profileModal ? (
                    <ProfileModal ref={modalRef}>
                        <div
                            onClick={() => navigate('/mypage')}
                            className="inner"
                        >
                            <img src={mypage} />
                            마이페이지
                        </div>
                        <div
                            onClick={() => console.log('로그아웃')}
                            className="inner"
                        >
                            <img src={logout} />
                            로그아웃
                        </div>
                    </ProfileModal>
                ) : null}
            </Container>
        </Wrapper>
    );
};

export default Nav;

// 커스텀 styled-components

const Wrapper = styled.div`
    position: fixed;
    z-index: 998;
    width: 100%;
    height: 55px;
    padding: 0 20px;
    border-bottom: 1px solid var(--grey-300, #eaecee);
    background: var(--white, #fff);
    display: flex;
    justify-content: center;
    align-items: center;
    &.fade-in {
        animation: show 0.8s;
        @keyframes show {
            from {
                opacity: 0;
                margin-top: -60px;
            }
            to {
                opacity: 1;
                margin-top: 0px;
            }
        }
    }
    &.fade-out {
        margin-top: -60px;
        animation: disappear 0.5s;
        @keyframes disappear {
            from {
                opacity: 1;
                margin-top: 0px;
            }
            to {
                opacity: 0;
                margin-top: -60px;
            }
        }
    }
`;

const Container = styled.div`
    position: relative;
    width: 60%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    @media (max-width: 1120px) {
        width: 672px;
    }
    @media (max-width: 500px) { // 미디어 쿼리는 프로젝트에 맞게 조정하세요
        .left, .right {
        display: none; // 기존 네비게이션 요소들을 숨깁니다
        }
    }
    .left {
        width: 60%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .right {
        width: 20%;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
    img {
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -o-user-select: none;
        user-select: none;
        -webkit-user-drag: none;
        -khtml-user-drag: none;
        -moz-user-drag: none;
        -o-user-drag: none;
    }
`;

const Logo = styled.img`
    height: 16px;
    cursor: pointer;
    @media (max-width: 500px) {
        margin-right: 20px;
    }
`;

const Text = styled(NavLink)`
    position: relative;
    flex-shrink: 0;
    width: 100px;
    color: var(--grey-900, #212224);
    font-family: Pretendard;
    font-size: 16px;
    font-weight: 500;
    text-decoration: none;
    display: flex;
    align-items: center;
    cursor: default;

    @media (max-width: 500px) {
        font-size: 14px;
        width: 80px;
    }

    &.first {
        margin-left: 10%;
    }
    img {
        width: 12px;
        display: none;
        position: absolute;
        left: -17px;
    }
    p {
        cursor: pointer;
    }
    p:hover + img {
        display: flex;
    }
    &:hover {
        text-decoration: underline; // 호버 시 밑줄 표시
      }
    
      &.active {
        font-weight: 700; // 활성 링크에 대한 스타일
        text-decoration: underline; // 활성 링크에 밑줄을 항상 표시
      }
`;

const LoginBtn = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px 20px;
    border-radius: 6px;
    background-color: var(--grey-900, #212224);
    color: var(--white, #fff);
    font-family: Pretendard;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
`;

const ChatBtn = styled(NavLink)`
    display: flex;
    border-radius: 6px;
    background-color: transparent;
    &:hover {
        background-color: var(--grey-200, #f2f4f6);
    }
    &:active {
        background-color: var(--grey-300, #eaecee);
    }
    &.active {
        display: none;
    }
    img {
        width: 20px;
        padding: 6px;
    }
`;

const ProfileBtn = styled.div`
    width: 56px;
    height: 36px;
    padding: 0 4px;
    border-radius: 18px;
    margin-left: 5%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    &:hover {
        background-color: var(--grey-200, #f2f4f6);
    }
    &:active {
        background-color: var(--grey-300, #eaecee);
    }
    .profile-img {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        border: 0.5px solid var(--grey-300, #eaecee);
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
`;

const ProfileModal = styled.div`
    position: absolute;
    top: 47px;
    right: 2px;
    z-index: 999;
    width: 128px;
    height: 88px;
    border-radius: 6px;
    border: 1px solid var(--grey-400, #dcdfe3);
    background-color: var(--white, #fff);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .inner {
        width: 120px;
        height: 40px;
        border-radius: 4px;
        color: var(--grey-900, #212224);
        font-family: Pretendard;
        font-size: 16px;
        font-weight: 500;
        display: flex;
        align-items: center;
        &:hover {
            background-color: var(--grey-300, #eaecee);
        }
        &:active {
            background-color: var(--grey-400, #dcdfe3);
        }
        img {
            width: 16px;
            margin: 0 8px 0 11px;
        }
    }
`;

const MobileMenu = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 55px;
    left: 0;
    right: 0;
    width: 100%;
    background: white;
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
    z-index: 1000;
    transition: transform 0.5s ease-in-out; // 부드러운 변환 효과를 위해 추가
  }

  // 스크롤에 따른 메뉴의 보이기/숨기기 효과를 위한 스타일
  &.menu-visible {
    transform: translateY(0); // 메뉴가 보이는 위치
  }
  &.menu-hidden {
    transform: translateY(-140%); // 메뉴가 화면 위로 사라지는 위치
  }
`;

const MobileNavLink = styled(NavLink)`
  padding: 10px 20px;
  color: var(--grey-900, #212224); // 텍스트 색상을 검은색으로 설정
  text-decoration: none; // 기본 밑줄 제거
  margin-top: 10px;
  margin-bottom: 5px;

  &:hover {
    text-decoration: underline; // 호버 시 밑줄 표시
  }

  &.active {
    font-weight: 700; // 활성 링크에 대한 스타일
    text-decoration: underline; // 활성 링크에 밑줄을 항상 표시
  }
`;

const MobileMenuIcon = styled.div`
  display: none; // 기본적으로는 숨김 처리

  @media (max-width: 768px) { // 미디어 쿼리는 프로젝트에 맞게 조정하세요
    display: block; // 모바일 뷰에서만 보이도록 설정
    position: absolute; // 절대 위치
    top: 0; // 상단에 고정
    right: 0; // 오른쪽 끝에 고정
    padding: 4px; // 필요에 따라 패딩 조정
    cursor: pointer;
    margin-right: 30px;
  }
`;

const DesktopNavLinks = styled.div`
  @media (max-width: 500px) {
    display: none; // 모바일 화면에서는 텍스트 버튼들을 숨깁니다
  }

  // 데스크탑 화면에서는 텍스트 버튼들을 보여주기 위한 스타일
  display: flex;
  align-items: center;
  justify-content: center;
  // 필요한 경우 추가 스타일
`;
