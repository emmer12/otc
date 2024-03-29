import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
 :root {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;

  /* color-scheme: light dark; */
  /* color: rgba(255, 255, 255, 0.87); */
  background-color: #fff;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}

::-moz-selection { /* Code for Firefox */
  color: #170728;
  background: #ABE5B9;
}

::selection {
  color: #170728;
  background: #ABE5B9;
}


/* @media (prefers-color-scheme: light) {
  :root {
    color: #213547;
    background-color: #fafafa;
  }
} */

  body {
   background:#f5f4f6;
   font-family: 'Space Grotesk', sans-serif;
    a{
      color:#000000;
      text-decoration:none;
      &:hover{
      }
    }

    .pagination{
      display: flex;
      list-style: none;
      gap:5px;
      width: 120px;

    .page-item{
     
    


    &.active,&:hover{
     .page-link{

       background: #170728;
       color: #fff;
      } 

    
    }
    
    .page-link{
    color:#170728;
 height: 40px;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border:1px solid #170728;
    cursor:pointer ;
    transition:0.5s;
    }
    }

    }

  }

  *{
    margin:0px;
    padding:0px;
    box-sizing:border-box
  }


`;

export const OtcBg = styled.div``;

export const Dashboard = styled.div`
  display: flex;
`;
