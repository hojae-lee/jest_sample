const puppeteer = require("puppeteer"); // 브라우저를 열고 지지고 볶는 모듈
const {toMatchImageSnapshot}  = require("jest-image-snapshot"); // 캡쳐 모듈
expect.extend({toMatchImageSnapshot}); // 캡쳐모듈 연결

// 테스트 파일에 많은 수의 테스트 함수가 작성되어 있는 경우 연관된 테스트 함수들끼리 그룹화.
describe("IBSheet8 test", () => {
    test("IBSheet8 test start", async () => {

        const browser = await puppeteer.launch({
    
            headless: false, // 테스트시 직접 브라우저 오픈 여부 (false 하면 오픈 사용함)
            slowMo: 100, // 설정 안하면 마우스, 키보드 동작이 너무 빠름
            defaultViewport: {width: 1920, height: 969}, // 창 안에 보여지는 실제 영역 크기
            timeout: 0,
            args: [
                '--window-size=1920,1040', //열리는 창크기
                '--lang=ko', //의미없는 듯
            ]
        });
    
        // 브라우저 내에 새 탭을 생성
        const page = await browser.newPage();
        // 특정 URL로 이동 timeout을 ms로 설정해두면 해당 시간 안에 이동하지 못했을 시 오류 발생. 0으로 설정하면 무제한 기다림.
        await page.goto("http://localhost:3000/html/main.html", {timeout: 0});
        await page.mouse.click(122, 192);
        await page.waitFor(500); // 0.5초 기다림.
        await page.mouse.click(91, 229);
        await page.waitFor(500);
        await page.mouse.click(757, 390);
        await page.waitFor(500);
    
        // 브라우저 내에 특정 스크립트 구동하기
        await page.addScriptTag({ content: 
            `
                const a = "Data";
                document.querySelector("#myTabs_contents-0").value = a;
            `
        });
    
        // 객체 value 얻기
        let aValue = await page.$eval('#myTabs_contents-0', (input) => input.value);
    
        // try, catch를 하지 않으면 오류 발생시 test가 중단됨.
        try {
            // 가져온 값과 원래 기대하는 값을 비교.
            expect(aValue).toEqual("아무거나");
        } catch(e) {
            console.log("값이 서로 다릅니다.");
        }

        // 최초 시 __image_snapshots__ 폴더에 이미지가 생성되고, 두번째 테스트시 기존 이미지와 비교하여 다른 경우 오류가 발생한다.
        // 오류가 생길 경우 __image_snapshots__/_diff_output_ 안에 서로의 이미지를 비교한 이미지가 생성된다.
        const png = await page.screenshot();

        try {
            expect(png).toMatchImageSnapshot();
            console.log("캡처 이미지 비교 성공");
        } catch (e) {
            console.log("캡쳐된 이미지를 비교하는 과정에서 오류가 발생하였습니다.");
        }

        await browser.close();
    
    }, 30000); // 해당 테스트는 30초 내로 끝나야 정상이라는 의미. 시간을 넘어가면 에러 발생.

    test("IBSheet8 test end", async () => {

        const browser2 = await puppeteer.launch({
    
            headless: false,
            slowMo: 100,
            defaultViewport: {width: 1920, height: 969},
            timeout: 0,
            args: [
                '--window-size=1920,1040', //열리는 창크기
                '--lang=ko', //의미없는 듯
            ]
        });
    
        const page2 = await browser2.newPage();
        await page2.goto("http://localhost:3000/html/main.html", {timeout: 0});

        await page2.mouse.click(77, 327);
        await page2.waitFor(500);

        await page2.addScriptTag({ content: 
            `
                alert("test end");
            `
        });

        await browser2.close();

    }, 30000);

});