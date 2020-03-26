const puppeteer = require('puppeteer');
const {
    toMatchImageSnapshot
} = require('jest-image-snapshot');
const {
    baseInfo,
    callPageWindowAPI
} = require("../../baseInfo");

expect.extend({
    toMatchImageSnapshot
});

//현재 파일명을 기준으로 .test.js 를 떼어낸 화면으로 이동
const fileName = __filename.substring(__filename.lastIndexOf("\\") + 1, __filename.lastIndexOf(".") - 5);
const datas = require('./../../datas/customer-samples/' + fileName + 'Data');

let browser = null;
let page = null;

beforeAll(async () => {
    browser = await puppeteer.launch(baseInfo.luncherConfig);
    page = await browser.pages();

    if (!page || (page && !page[0])) {
        if (!page) {
            page = [];
        }
        page[0] = browser.newPage();
    }

    await page[0].goto(baseInfo.url, {
        timeout: 0
    });

    // 페이지 이동
    await callPageWindowAPI({
        page: page[0],
        name: 'movePage',
        args: [fileName + '.js']
    });

    await page[0].waitFor(2000);
}, 30000);

afterAll(async () => {
    // 브라우저 종료
    await browser.close();
});

/************************ 기본 기능 테스트 **********************/
describe(fileName + ' Basic', () => {
    test(fileName + ' ', async () => {

    }, 30000);
});

/************************ 화면 별 기능 테스트 **********************/
describe(fileName + ' ', () => {
    test(fileName + ' ', async () => {

        //첫 이미지
        const png = await page[0].screenshot();
        expect(png).toMatchImageSnapshot();
    });

    test(fileName + ' ', async () => {

        await page[0].mouse.click(82, 311);

        for (let i = 0; i < 2; i++) {
            await page[0].mouse.move(1037.890625, 455.484375);
            await page[0].mouse.down();
            await page[0].mouse.move(1377.5, 468.5);
            await page[0].mouse.up();
        }

        const horizontalData = await page[0].evaluate(() => {
            const hfirstChild = document.querySelector("#pivotDialogsheet_PivotRow").firstElementChild.firstElementChild.innerText;
            const hsecondChild = document.querySelector("#pivotDialogsheet_PivotRow").firstElementChild.nextElementSibling.innerText;

            if (hfirstChild == "성별" && hsecondChild == "연령대") {
                return true;
            }
            return false;
        });

        if (horizontalData) {
            await page[0].mouse.move(1037.890625, 455.484375);
            await page[0].mouse.down();
            await page[0].mouse.move(1377.5, 618);
            await page[0].mouse.up();
        }

        const verticalData = await page[0].evaluate(() => {
            const vfisrtChild = document.querySelector("#pivotDialogsheet_PivotCol").firstElementChild.firstElementChild.innerText;

            if (vfisrtChild == "거주지") {
                return true;
            }
            return false;
        });

        if (verticalData) {
            await page[0].mouse.move(1037.890625, 656.5);
            await page[0].mouse.down();
            await page[0].mouse.move(1377.5, 766.5);
            await page[0].mouse.up();
        }

        const dataData = await page[0].evaluate(() => {
            const dfirstChild = document.querySelector("#pivotDialogsheet_PivotData").firstElementChild.firstElementChild.innerText;

            if (dfirstChild == "나이") {
                return true;
            }
            return false;
        });

        if (dataData) {
            await page[0].mouse.click(1409.78125, 856);
            await page[0].waitFor(500);
        }
    });

    test(fileName + ' 초기화', async () => {

        await page[0].mouse.click(82, 311);
        await page[0].waitFor(500);

        await page[0].mouse.click(1331.5625, 856);
    });

    test(fileName + ' 마지막 이미지 찍기', async () => {

        // 첫 이미지와 마지막 이미지 비교
        const png = await page[0].screenshot();
        expect(png).toMatchImageSnapshot();
    });
});

describe(fileName + " ", () => {
    test(fileName + ' ', async () => {
        // 해당 자바스크립트 코드를 실행시켜 return 값으로 전달 가능.
        const ret = await page[0].evaluate(() => { 
            return true;
        });
        expect(ret).toEqual(true);
    });
});