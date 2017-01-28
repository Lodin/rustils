import {expect} from 'chai';
import {Some, None} from './option';
import {Ok, Err, Result} from './result';

describe('Function "Ok"', () => {
  it('should create Result with value', () => {
    expect((<any>Ok(10)).value).to.be.eq(10);
    expect((<any>Ok(10)).error).to.be.null;
  });
});

describe('Function "Err"', () => {
  it('should create Result with error', () => {
    expect((<any>Err('error')).value).to.be.null;
    expect((<any>Err('error')).error).to.be.eq('error');
  });
});

describe('Class "Result"', () => {
  let ok: Result<number, string>;
  let err: Result<number, string>;

  beforeEach(() => {
    ok = Ok(20);
    err = Err('error');
  });

  describe('notifiers', () => {
    it('should show when the Result is Ok', () => {
      expect(ok.isOk).to.be.true;
      expect(err.isOk).not.to.be.true;
    });

    it('should show when the Result is Err', () => {
      expect(ok.isErr).not.to.be.true;
      expect(err.isErr).to.be.true;
    });
  });

  describe('ok', () => {
    it('should get Some of Option if the Result is Ok', () => {
      expect(ok.ok).to.be.deep.eq(Some(20));
    });

    it('should get None of Option if the Result is Err', () => {
      expect(err.ok).to.be.deep.eq(None());
    });
  });

  describe('err', () => {
    it('should get Some of Option if the Result is Err', () => {
      expect(err.err).to.be.deep.eq(Some('error'));
    });

    it('should get None of Option if the Result is Ok', () => {
      expect(ok.err).to.be.deep.eq(None());
    });
  });

  describe('map', () => {
    it('should map value in accordance with callback if the Result is Ok', () => {
      expect(ok.map(v => v + 20)).to.be.deep.eq(Ok(40));
    });

    it('should get Err itself if the Result is Err', () => {
      expect(err.map(v => v + 20)).to.be.deep.eq(Err('error'));
    });
  });

  describe('mapErr', () => {
    it('should map value in accordance with callback if the Result is Err', () => {
      expect(err.mapErr(v => v + 's')).to.be.deep.eq(Err('errors'));
    });

    it('should get Ok itself if the Result is Ok', () => {
      expect(ok.mapErr(v => v + 's')).to.be.deep.eq(Ok(20));
    });
  });

  describe('match', () => {
    it('should match Ok expression by type', () => {
      expect(ok.match({
        Ok: v => v + 10,
        Err: () => 100
      })).to.be.eq(30);
    });

    it('should match Err expression by type', () => {
      expect(err.match({
        Ok: () => 'none',
        Err: e => e + 's'
      })).to.be.eq('errors');
    });
  });

  describe('and', () => {
    it('should get received Result if the Result is Ok', () => {
      expect(ok.and(Ok('str'))).to.be.deep.eq(Ok('str'));
    });

    it('should get an Err itself if the Result is Error', () => {
      expect(err.and(Ok('str'))).to.be.eq(err);
    });
  });

  describe('andThen', () => {
    it('should get wrapped result of the callback if the Result is Ok', () => {
      expect(ok.andThen(v => Ok(v + 20))).to.be.deep.eq(Ok(40));
    });

    it('should get Err itself if the Result is Err', () => {
      expect(err.andThen(v => Ok(v + 20))).to.be.eq(err);
    });
  });

  describe('or', () => {
    it('should get the Result itself if the Result is Ok', () => {
      expect(ok.or(Ok(50))).to.be.eq(ok);
    });

    it('should get received Result if the Result is Err', () => {
      expect(err.or(Ok(50))).to.be.deep.eq(Ok(50));
    });
  });

  describe('orElse', () => {
    it('should get the Result itself if the Result is Ok', () => {
      expect(ok.orElse(() => Ok(50))).to.be.eq(ok);
    });

    it('should get calculated Result if the Result is Err', () => {
      expect(err.orElse(() => Ok(50))).to.be.deep.eq(Ok(50));
    });
  });

  describe('unwrapOr', () => {
    it('should get the value if the Result is Ok', () => {
      expect(ok.unwrapOr(1)).to.be.eq(20);
    });

    it('should get received value if the Result is Err', () => {
      expect(err.unwrapOr(1)).to.be.eq(1);
    });
  });

  describe('unwrapOrElse', () => {
    it('should get the value if the Result is Ok', () => {
      expect(ok.unwrapOrElse(() => 110)).to.be.eq(20);
    });

    it('should get calculated value if the Result is Err', () => {
      expect(err.unwrapOrElse(() => 100)).to.be.eq(100);
    });
  });

  describe('unwrap', () => {
    it('should get the value if the Result is Ok', () => {
      expect(ok.unwrap()).to.be.eq(20);
    });

    it('should throw an error with Err value if the Result is Err', () => {
      expect(() => err.unwrap()).to.throw('error');
    });
  });

  describe('unwrapErr', () => {
    it('should get the Err value if the Result is Err', () => {
      expect(err.unwrapErr()).to.be.eq('error');
    });

    it('should throw an error with Ok value if the Result is Ok', () => {
      expect(() => ok.unwrapErr()).to.throw('20');
    });
  });

  describe('expect', () => {
    it('should get the value if the Result is Ok', () => {
      expect(ok.expect('something happened')).to.be.eq(20);
    });

    it('should throw an error if the Result is Err', () => {
      expect(() => err.expect('something happened')).to.throw('something happened');
    });
  });
});
