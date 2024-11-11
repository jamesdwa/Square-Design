import * as assert from 'assert';
import { solid, split, toJson, fromJson, receiveSubtree, replaceSubtree } from './square';
import { cons, nil } from './list';

describe('square', function() {

  it('toJson', function() {
    assert.deepStrictEqual(toJson(solid("white")), "white");
    assert.deepStrictEqual(toJson(solid("green")), "green");

    const s1 = split(solid("blue"), solid("orange"), solid("purple"), solid("white"));
    assert.deepStrictEqual(toJson(s1),
      ["blue", "orange", "purple", "white"]);

    const s2 = split(s1, solid("green"), s1, solid("red"));
    assert.deepStrictEqual(toJson(s2),
      [["blue", "orange", "purple", "white"], "green",
       ["blue", "orange", "purple", "white"], "red"]);

    const s3 = split(solid("green"), s1, solid("yellow"), s1);
    assert.deepStrictEqual(toJson(s3),
      ["green", ["blue", "orange", "purple", "white"],
       "yellow", ["blue", "orange", "purple", "white"]]);
  });

  it('fromJson', function() {
    assert.deepStrictEqual(fromJson("white"), solid("white"));
    assert.deepStrictEqual(fromJson("green"), solid("green"));

    const s1 = split(solid("blue"), solid("orange"), solid("purple"), solid("white"));
    assert.deepStrictEqual(fromJson(["blue", "orange", "purple", "white"]), s1);

    assert.deepStrictEqual(
        fromJson([["blue", "orange", "purple", "white"], "green",
                 ["blue", "orange", "purple", "white"], "red"]),
        split(s1, solid("green"), s1, solid("red")));

    assert.deepStrictEqual(
        fromJson(["green", ["blue", "orange", "purple", "white"],
                  "yellow", ["blue", "orange", "purple", "white"]]),
        split(solid("green"), s1, solid("yellow"), s1));
  });

  it("receiveSubtree", function () {
    const s1 = split(
      solid("yellow"),
      solid("green"),
      solid("blue"),
      solid("red")
    );
    const s2 = split(
      solid("red"),
      split(solid("blue"), solid("yellow"), solid("green"), solid("red")),
      solid("purple"),
      solid("blue")
    );
    const s3 = split(
      solid("green"),
      split(
        solid("red"),
        solid("blue"),
        solid("purple"),
        split(solid("yellow"), solid("green"), solid("red"), solid("blue"))
      ),
      solid("red"),
      solid("purple")
    );
    const s4 = split(
      solid("red"),
      split(
        solid("green"),
        solid("purple"),
        solid("blue"),
        split(
          split(solid("blue"), solid("purple"), solid("green"), solid("red")),
          solid("purple"),
          solid("blue"),
          solid("green")
        )
      ),
      solid("blue"),
      solid("red")
    );

    // 0-1-many heuristic - base case
    assert.deepStrictEqual(receiveSubtree(solid("yellow"), nil), solid("yellow"));

    // 0-1-many heuristic - base case
    assert.deepStrictEqual(receiveSubtree(s1, nil), s1);

    // 0-1-many heuristic - 1 recursive call
    assert.deepStrictEqual(receiveSubtree(s1, cons("NW", nil)), solid("yellow"));

    // 0-1-many heuristic - 1 recursive call
    assert.deepStrictEqual(receiveSubtree(s1, cons("NE", nil)), solid("green"));

    // 0-1-many heuristic — >1 recursive call
    assert.deepStrictEqual(
      receiveSubtree(s2, cons("NE", cons("SW", nil))),
      solid("green")
    );

    // 0-1-many heuristic — >1 recursive call
    assert.deepStrictEqual(
      receiveSubtree(s3, cons("NE", cons("SE", cons("NW", nil)))),
      solid("yellow")
    );

    // All direction test
    assert.deepStrictEqual(
      receiveSubtree(s4, cons("NE", cons("SE", cons("NW", cons("NE", nil))))),
      solid("purple")
    );
  });

  it("replaceSubtree", function () {
    const s1 = split(
      solid("blue"),
      solid("yellow"),
      solid("green"),
      solid("red")
    );
    const s2 = split(
      solid("blue"),
      split(solid("blue"), solid("green"), solid("yellow"), solid("red")),
      solid("purple"),
      solid("blue")
    );
    const s3 = split(
      solid("green"),
      split(
        solid("blue"),
        solid("red"),
        solid("purple"),
        split(solid("red"), solid("green"), solid("blue"), solid("yellow"))
      ),
      solid("blue"),
      solid("purple")
    );
    const s4 = split(
      solid("blue"),
      split(
        solid("green"),
        solid("purple"),
        solid("red"),
        split(
          split(solid("red"), solid("purple"), solid("green"), solid("blue")),
          solid("green"),
          solid("blue"),
          solid("red")
        )
      ),
      solid("red"),
      solid("blue")
    );

    // 0-1-many heuristic - base case
    assert.deepStrictEqual(
      replaceSubtree(solid("blue"), nil, solid("red")),
      solid("red")
    );

    // 0-1-many heuristic - base case
    assert.deepStrictEqual(replaceSubtree(s1, nil, solid("blue")), solid("blue"));

    // 0-1-many heuristic - 1 recursive call
    assert.deepStrictEqual(
      replaceSubtree(s1, cons("NW", nil), solid("green")),
      split(solid("green"), solid("yellow"), solid("green"), solid("red"))
    );

    // 0-1-many heuristic - 1 recursive call
    assert.deepStrictEqual(
      replaceSubtree(s1, cons("NE", nil), solid("red")),
      split(solid("blue"), solid("red"), solid("green"), solid("red"))
    );

    // 0-1-many heuristic - >1 recursive call
    assert.deepStrictEqual(
      replaceSubtree(s2, cons("NE", cons("SW", nil)), s1),
      split(
        solid("blue"),
        split(solid("blue"), solid("green"), s1, solid("red")),
        solid("purple"),
        solid("blue")
      )
    );

    // 0-1-many heuristic - >1 recursive call
    assert.deepStrictEqual(
      replaceSubtree(s3, cons("NE", cons("SE", cons("NW", nil))), s1),
      split(
        solid("green"),
        split(
          solid("blue"),
          solid("red"),
          solid("purple"),
          split(s1, solid("green"), solid("blue"), solid("yellow"))
        ),
        solid("blue"),
        solid("purple")
      )
    );

    // All direction test
    assert.deepStrictEqual(
      replaceSubtree(s4, cons("NE", cons("SE", cons("NW", cons("NE", nil)))), s3),
      split(
        solid("blue"),
        split(
          solid("green"),
          solid("purple"),
          solid("red"),
          split(
            split(solid("red"), s3, solid("green"), solid("blue")),
            solid("green"),
            solid("blue"),
            solid("red")
          )
        ),
        solid("red"),
        solid("blue")
      )
    );
  });
});